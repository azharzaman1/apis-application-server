import API from "../models/apiModal.js";
import fetch from "node-fetch";
import config from "../config/env.js";

export const getAllAPIs = async (req, res) => {
  try {
    const found = await API.find().exec();
    if (!found) {
      res.statusMessage = "Nothing Found";
      return res.sendStatus(204);
    }
    res.statusMessage = "Data Found";
    res.status(200).json(found);
  } catch (err) {
    res.statusMessage = err.message;
    res.sendStatus(500);
  }
};

export const getManyAPIs = async (req, res) => {
  const ids = req.body.ids;
  try {
    const result = await API.find({
      _id: { $in: ids },
    });

    if (!result) {
      res.statusMessage = "Nothing Found";
      return res.sendStatus(204);
    }
    res.statusMessage = "Data Found";
    res.status(200).json(result);
  } catch (err) {
    res.statusMessage = err.message;
    res.sendStatus(500);
  }
};

export const getAPIById = async (req, res) => {
  const id = req.params.id;
  try {
    const found = await API.findById(id).exec();
    if (!found) {
      res.statusMessage = "Data Found";
      return res.sendStatus(204);
    }

    console.log(found);
    res.status(200).json(found);
  } catch (err) {
    res.statusMessage = err.message;
    res.sendStatus(500);
  }
};

export const syncAPIsInMongoDB = async (req, res) => {
  try {
    // fetch data from API
    const response = await fetch(config.APIs_API_ENDPOINT);
    const data = await response.json();

    if (!data.entries || data.entries.length < 1) {
      res.statusMessage = "Nothing found";
      res.sendStatus(204);
    }

    // Store data to MongoDB

    data.entries.forEach(async (entry) => {
      const created = await API.create(entry);
      console.log("created", created);
    });

    res.statusMessage = "Data fetched and synced in MongoDB";
    res.sendStatus(201);
  } catch (err) {
    console.log(err.message);
    res.statusMessage = err.message;
    res.sendStatus(500);
  }
};
