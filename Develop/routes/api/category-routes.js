const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // finds all categories
  try {
    const categories = await Category.findAll({
      include: [{model: Product}]
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // finds one category by its `id` value
  try {
    const category = await Category.findByPk(req.params.id, {
       include: [{model: Product}]
    });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // creates a new category
  try {
    const createCategory = await Category.create(req.body);
    res.status(200).json(createCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // updates a category by its `id` value
  try {
    const categoryUpdate = await Category.update(req.body, {
      where: {
        id: req.params.id, 
      },
    });
    res.status(200).json(categoryUpdate);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // deletes a category by its `id` value
  try{
    const deleteCategory = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deleteCategory) {
      console.log(1)
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }
    console.log(2)
    res.status(200).json(deleteCategory);
    
    } catch (err) {
      console.log(3)
    res.status(500).json(err);
  }
});

module.exports = router;
