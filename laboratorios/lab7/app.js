import Fastify from "fastify";
import cors from "@fastify/cors";

const PORT = 3000;

const db = {
    categories: [],
    products: [],
};

const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const ProductModel = {
    create: ({ name, price, categoryId }) => {
        const product = {
            id: generateId(),
            name,
            price,
            categoryId,
        };
        db.products.push(product);
        return product;
    },
    findAll: () => {
        return db.products.map((product) => {
            const category = CategoryModel.findById(product.categoryId);
            return {
                id: product.id,
                name: product.name,
                price: product.price,
                category: category,
            };
        });
    },
    findById: (id) => {
        const product = db.products.find((product) => product.id === id);
        if (!product) {
            return null;
        }
        const category = CategoryModel.findById(product.categoryId);
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            category,
        };
    },
};

const CategoryModel = {
    create: ({ name }) => {
        const category = {
            id: generateId(),
            name,
        };
        db.categories.push(category);
        return category;
    },
    findAll: () => {
        return db.categories;
    },
    findById: (id) => {
        return db.categories.find((category) => category.id === id);
    },
};

CategoryModel.create({ name: "Category 1" });
CategoryModel.create({ name: "Category 2" });
CategoryModel.create({ name: "Category 3" });
ProductModel.create({ name: "Product 1", price: 100, categoryId: db.categories[0].id });
ProductModel.create({ name: "Product 2", price: 200, categoryId: db.categories[1].id });
ProductModel.create({ name: "Product 3", price: 300, categoryId: db.categories[2].id });

const fastify = Fastify({
    logger: true,
});

fastify.register(cors, {
    origin: "*",
});

fastify.get("/api/v1/categories", (req, res) => {
    return {
        data: CategoryModel.findAll(),
        count: CategoryModel.findAll().length,
    };
});

fastify.get("/api/v1/products", (req, res) => {
    return {
        data: ProductModel.findAll(),
        count: ProductModel.findAll().length,
    };
});

fastify.get("/api/v1/products/:id", (req, res) => {
    const product = ProductModel.findById(req.params.id);
    return product;
});

fastify.post("/api/v1/products", (req, res) => {
    const { name, price, categoryId } = req.body;
    const product = ProductModel.create({ name, price, categoryId });
    return product;
});

const start = async () => {
    try {
        await fastify.listen({ port: PORT });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
