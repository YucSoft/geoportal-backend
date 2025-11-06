import { queryDatabase } from '../services/db.service.js';

// Consulta SQL para obtener el catálogo de capas
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
    ORDER BY
        g.name, l.name;
`;

// Controlador para obtener el catálogo de capas
export const getCatalog = async (req, res) => {
    // Registrar la petición con información del usuario
    console.log(`Petición de catálogo por usuario: ${req.user.email} (Rol: ${req.user.rol})`);

    // Ejecutar la consulta para obtener las capas
    const result = await queryDatabase(CATALOG_QUERY);

    // Estructurar la respuesta en formato de catálogo
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
        // Añadir la capa al grupo correspondiente
        catalog[groupId].layers.push({
            id: row.layer_id,
            name: row.layer_name,
            description: row.layer_description,
            type: row.layer_type,
            symbology: row.symbology,
            workspace: row.workspace,
            wmsLayerName: row.wms_layer_name,
            url: row.url,
            options: row.options,
            bounds: row.bounds,
        });
    });

    res.json(catalog);
};