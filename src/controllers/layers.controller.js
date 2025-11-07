import { queryDatabase } from '../services/db.service.js';
const CATALOG_QUERY = `
    SELECT
        g.id AS group_id, 
        g.name AS group_name, 
        g.icon AS group_icon,
        l.id AS layer_id, 
        l.name AS layer_name, 
        l.description AS layer_description,
        l.type AS layer_type, 
        l.symbology, l.workspace,
        l.layername, 
        l.layertype AS "layerType",
        l.url, l.options, l.bounds
    FROM
        layer_groups g
    JOIN
        layers l ON g.id = l.group_id
    WHERE 
        g.institution_id = $1 AND l.institution_id = $1
    ORDER BY
        g.name, l.name;
`;

export const getCatalog = async (req, res, next) => {
    try {
        const institution = req.user.institution;
        if (!institution) {
            const err = new Error('Token inválido: no se encontró institución.');
            err.status = 400;
            throw err;
        }

        console.log(`Petición de catálogo por usuario: ${req.user.email} (Institución: ${institution})`);

        const result = await queryDatabase(CATALOG_QUERY, [institution]);
        const catalog = {};

        result.rows.forEach(row => {
            const groupId = row.group_id;
            if (!catalog[groupId]) {
                catalog[groupId] = {
                    name: row.group_name,
                    icon: row.group_icon,
                    layers: [],
                };
            }

            const wmsOptions = row.options || {};

            wmsOptions.layers = row.layername;

            catalog[groupId].layers.push({
                id: row.layer_id,
                name: row.layer_name,
                description: row.layer_description,
                type: row.layer_type,
                symbology: row.symbology,
                workspace: row.workspace,
                layerName: row.layername,
                layerType: row.layerType,
                url: row.url,
                bounds: row.bounds,
                options: wmsOptions
            });
        });

        res.json(catalog);
    } catch (err) {
        console.error("Error en getCatalog:", err);
        next(err);
    }
};