import mongoose from "mongoose";
import Story from "../models/storyContent.js";
import { v4 as uuidv4 } from "uuid";

const getStories = async (req, res) => {
  try {
    const story = await Story.find();
    res.status(200).json(story);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createStory = async (req, res) => {
  const body = req.body;

  const newStory = new Story({
    ...body,
    userId: uuidv4(),
    postDate: new Date().toISOString(),
  });

  try {
    await newStory.save();
    res.status(201).json(newStory);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updateStory = async (req, res) => {
  const { id: _id } = req.params;
  const story = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("This id doesn't belong to any story ");
  }
  const updatedStory = await Story.findByIdAndUpdate(_id, story, { new: true });
  res.json(updatedStory);
};

const deleteStory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("This id doesn't belong to any story ");
  }
  await Story.findByIdAndRemove(id);
  res.join({ message: "Story deleted successfully" });
};

const likeStory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("This id doesn't belong to any story ");
  }
  const story = await Story.findById(id);

  const updatedStory = await Story.findByIdAndUpdate(
    id,
    { likes: story.likes + 1 },
    { new: true }
  );

  res.join(updatedStory);
};

export { getStories, createStory, updateStory, deleteStory, likeStory };
