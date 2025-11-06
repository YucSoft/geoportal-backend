import { queryDatabase } from '../services/db.service.js';

const CATALOG_QUERY = `
    SELECT
        g.id AS group_id, g.name AS group_name, g.icon AS group_icon,
        l.id AS layer_id, l.name AS layer_name, l.description AS layer_description,
        l.type AS layer_type, l.symbology, l.workspace, l.wms_layer_name,
        l.layerType, l.url, l.options, l.bounds
    FROM
        layer_groups g
    JOIN
        layers l ON g.id = l.group_id
    WHERE 
        g.institution_id = $1 AND l.institution_id = $1
    ORDER BY
        g.name, l.name;
`;

export const getCatalog = async (req, res) => {
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
        catalog[groupId].layers.push({
            id: row.layer_id,
            name: row.layer_name,
            description: row.layer_description,
            type: row.layer_type,
            symbology: row.layer_symbology, 
            workspace: row.workspace,
            wmsLayerName: row.wms_layer_name,
            layerType: row.layerType,
            options: row.options,
            bounds: row.bounds,
        });
    });

    res.json(catalog);
};