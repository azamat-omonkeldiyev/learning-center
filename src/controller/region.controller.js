const Region = require("./../models/region.model");
const logger = require('../config/logger')

//  Yangi region qo'shish (Create)
const createRegion = async (req, res) => {
    try {
        logger.info("Creating region", {
            body: req.body,
            userId: req.userId || "unauthenticated",
          });
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Region name is required" });

        let RegionExists = await Region.findOne({where: {name}});
        if(RegionExists) return res.status(400).json({message: "region already created"})

        const region = await Region.create({ name });
        logger.info("Region created successfully", {
            regionId: region.id,
            name: region.name,
            userId: req.userId || "unauthenticated",
          });
        res.status(201).json({ region });
    } catch (error) {
        throw error
    }
};

//  Barcha regionlarni olish (Read All + Pagination)
const getAllRegions = async (req, res) => {
    try {
        logger.info("Fetching regions", {
            query: req.query,
            userId: req.userId || "unauthenticated",
          });
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
        logger.info("Regions fetched successfully", {
            total: regions.count,
            userId: req.userId || "unauthenticated",
          });
        res.json(response);
    } catch (error) {
        throw error
    }
};

//  ID bo‘yicha regionni olish (Read One)
const getRegionById = async (req, res) => {
    try {
        logger.info("Fetching region by ID", {
            regionId: req.params.id,
            userId: req.userId || "unauthenticated",
          });
        const { id } = req.params;

        const region = await Region.findByPk(id);
        if (!region) return res.status(404).json({ message: "Region not found" });
        logger.info("Region fetched successfully", {
            regionId: id,
            userId: req.userId || "unauthenticated",
          });
        res.status(200).json(region);
    } catch (error) {
        throw error
    }
};

//  Regionni yangilash (Update)
const updateRegion = async (req, res) => {
    try {
        logger.info("Updating region", {
            regionId: req.params.id,
            body: req.body,
            userId: req.userId || "unauthenticated",
          });
        const { id } = req.params;
        const { name } = req.body;

        const region = await Region.findByPk(id);
        if (!region) return res.status(404).json({ message: "Region not found" });

        region.name = name || region.name;
        await region.save();
        logger.info("Region updated successfully", {
            regionId: id,
            userId: req.userId || "unauthenticated",
          });
        res.status(200).json({ region });
    } catch (error) {
        throw error
    }
};

//  Regionni o'chirish (Delete)
const deleteRegion = async (req, res) => {
    try {
        logger.info("Deleting region", {
            regionId: req.params.id,
            userId: req.userId || "unauthenticated",
          });
        const { id } = req.params;
        const region = await Region.findByPk(id);
        if (!region) return res.status(404).json({ message: "Region not found" });

        await region.destroy();
        logger.info("Region deleted successfully", {
            regionId: id,
            userId: req.userId || "unauthenticated",
          });
        res.status(200).json({ message: "Region deleted" });
    } catch (error) {
        throw error
    }
};

module.exports = {
    createRegion,
    getAllRegions,
    getRegionById,
    updateRegion,
    deleteRegion,
};
