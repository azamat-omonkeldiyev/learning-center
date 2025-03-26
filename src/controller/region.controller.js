const Region = require("./../models/region.model");

//  Yangi region qo'shish (Create)
const createRegion = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Region name is required" });

        let RegionExists = await Region.findOne({where: {name}});
        if(RegionExists) return res.status(400).json({message: "region already created"})

        const region = await Region.create({ name });
        res.status(201).json({ region });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "server error", error: error.message });
    }
};

//  Barcha regionlarni olish (Read All + Pagination)
const getAllRegions = async (req, res) => {
    try {
        const { page, limit, sortField, sortOrder } = req.query;

        const queryOptions = {
            order: [],
        };

        if (page && limit) {
            queryOptions.limit = parseInt(limit);
            queryOptions.offset = (parseInt(page) - 1) * parseInt(limit);
        }

        if (sortField && sortOrder) {
            queryOptions.order.push([
                sortField,
                sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC",
            ]);
        } else {
            queryOptions.order.push(["createdAt", "ASC"]);
        }

        const regions = await Region.findAndCountAll(queryOptions);

        const response = {
            data: regions.rows,
            total: regions.count,
        };

        if (page && limit) {
            response.page = parseInt(page);
            response.totalPages = Math.ceil(regions.count / limit);
        }

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

//  ID bo‘yicha regionni olish (Read One)
const getRegionById = async (req, res) => {
    try {
        const { id } = req.params;

        const region = await Region.findByPk(id);
        if (!region) return res.status(404).json({ message: "Region not found" });

        res.status(200).json(region);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

//  Regionni yangilash (Update)
const updateRegion = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const region = await Region.findByPk(id);
        if (!region) return res.status(404).json({ message: "Region not found" });

        region.name = name || region.name;
        await region.save();

        res.status(200).json({ region });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

//  Regionni o'chirish (Delete)
const deleteRegion = async (req, res) => {
    try {
        const { id } = req.params;
        const region = await Region.findByPk(id);
        if (!region) return res.status(404).json({ message: "Region not found" });

        await region.destroy();
        res.status(200).json({ message: "Region deleted" });
    } catch (error) {
        console.log(error)
        res.status(500).json({  error: error.message });
    }
};

module.exports = {
    createRegion,
    getAllRegions,
    getRegionById,
    updateRegion,
    deleteRegion,
};
