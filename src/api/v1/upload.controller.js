import AdmZip from 'adm-zip';
import shapefile from 'shapefile';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import os from 'os';
import ApiError from '../../utils/ApiError.js';

const parseShapefile = async (paths) => {
    const features = [];
    const shpPath = paths.shp;
    const dbfPath = paths.dbf;

    if (!shpPath || !dbfPath) {
        throw new ApiError(400, 'El archivo .zip debe contener al menos un .shp y un .dbf');
    }

    return new Promise((resolve, reject) => {
        shapefile.open(shpPath, dbfPath)
            .then(source => {
                const readRecords = () => {
                    source.read().then(function log(result) {
                        if (result.done) {
                            resolve({
                                type: "FeatureCollection",
                                features: features
                            });
                            return;
                        }
                        features.push(result.value);
                        readRecords();
                    }).catch(reject);
                };
                readRecords();
            })
            .catch(reject);
    });
};

const extractZipInMemory = (buffer) => {
    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();
    const tempDir = path.join(os.tmpdir(), `shapefile-upload-${uuidv4()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    let shpPath = null;
    let dbfPath = null;
    let shxPath = null;

    zipEntries.forEach(entry => {
        const entryName = entry.entryName.toLowerCase();
        const targetPath = path.join(tempDir, entry.name);

        if (!entry.isDirectory) {
            fs.writeFileSync(targetPath, entry.getData());

            if (entryName.endsWith('.shp')) shpPath = targetPath;
            if (entryName.endsWith('.dbf')) dbfPath = targetPath;
            if (entryName.endsWith('.shx')) shxPath = targetPath;
        }
    });

    if (!shpPath || !dbfPath) {
        fs.rmSync(tempDir, { recursive: true, force: true });
        throw new ApiError(400, 'El archivo .zip debe contener archivos .shp y .dbf');
    }

    return { shp: shpPath, dbf: dbfPath, shx: shxPath, tempDir: tempDir };
};

export const uploadShapefile = async (req, res, next) => {
    if (!req.file) {
        throw new ApiError(400, 'No se proporcionó ningún archivo.');
    }

    let extractedFiles;
    try {
        extractedFiles = extractZipInMemory(req.file.buffer);
        const geoJson = await parseShapefile(extractedFiles);

        res.status(200).json({
            fileName: req.file.originalname,
            geoJsonData: geoJson
        });

    } catch (error) {
        console.error('Error al procesar Shapefile:', error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, error.message || 'Error al procesar el Shapefile.');
    } finally {
        if (extractedFiles && extractedFiles.tempDir) {
            fs.rmSync(extractedFiles.tempDir, { recursive: true, force: true });
        }
    }
};