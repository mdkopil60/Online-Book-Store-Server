import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ================= Root =================
app.get("/", (req, res) => {
    res.send("BookVerse API Running...");
});

app.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Server Working Successfully",
    });
});

// ================= MongoDB =================

const uri = process.env.MONGO_DB_URI;

if (!uri) {
    throw new Error("❌ MONGO_DB_URI is missing");
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

const db = client.db(process.env.AUTH_DB_NAME);

const booksCollection = db.collection("books");
const cartCollection = db.collection("cart");

async function connectDB() {
    try {
        await client.connect();

        await db.command({ ping: 1 });

        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Error:", error);
        process.exit(1);
    }
}
// Add to cart
app.get("/cart", async (req, res) => {
    try {
        const result = await cartCollection.find().toArray();
        res.send(result);
    }
    catch (error) {

        res.status(500).send({
            message: "Failed to get cart"
        })
    }

});
app.post("/cart", async (req, res) => {
    try {
        const cartItem = req.body;

        const result = await cartCollection.insertOne(cartItem);

        res.send(result);
    } catch (error) {
        res.status(500).send({
            message: "Failed to Add Cart",
        });
    }
});
app.delete("/cart/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const result = await cartCollection.deleteOne({
            _id: new ObjectId(id),
        });

        res.send(result);
    } catch (error) {
        res.status(500).send({
            message: "Delete Failed",
        });
    }
});


// ================= GET All Books =================

app.get("/books", async (req, res) => {
    try {
        const books = await booksCollection.find().toArray();

        res.status(200).json(books);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch books",
        });
    }
});

// ================= GET Single Book =================

app.get("/books/:id", async (req, res) => {
    try {
        const book = await booksCollection.findOne({
            _id: new ObjectId(req.params.id),
        });

        if (!book) {
            return res.status(404).json({
                message: "Book not found",
            });
        }

        res.json(book);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
});

// ================= Add Book =================

app.post("/books", async (req, res) => {
    try {
        const result = await booksCollection.insertOne(req.body);

        res.status(201).json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to add book",
        });
    }
});

// ================= Update Book =================

app.put("/books/:id", async (req, res) => {
    try {
        const result = await booksCollection.updateOne(
            {
                _id: new ObjectId(req.params.id),
            },
            {
                $set: req.body,
            }
        );

        res.json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Update Failed",
        });
    }
});

// ================= Delete Book =================

app.delete("/books/:id", async (req, res) => {
    try {
        const result = await booksCollection.deleteOne({
            _id: new ObjectId(req.params.id),
        });

        res.json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Delete Failed",
        });
    }
});

// ================= Start Server =================

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
    await connectDB();

    const server = app.listen(PORT, () => {
        console.log(` Server running on http://localhost:${PORT}`);
    });

    server.on("listening", () => {
        console.log("✅ Express is listening...");
    });

    server.on("error", (err) => {
        console.error("❌ Listen Error:", err);
    });
}

startServer();