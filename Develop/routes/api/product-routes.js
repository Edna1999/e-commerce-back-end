const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

router.get('/', async (req, res) => {
  // finds all products
  try {
    const products = await Product.findAll({
      include: [{model: Category, Tag}]
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // finds a single product by its `id`
  try {
    const product = await Product.findByPk(req.params.id, {
       include: [{model: Category, Tag}]
    });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  
    try {
      const createProduct = await Product.create(req.body);
      res.status(200).json(createProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// updates product
router.put('/:id', async(req, res) => {

  await Product.update(req.body, {
    where: {
      id: req.params.id, 
    },
  })
    .then((product) => {
      // finds all associated tags from ProductTag
      console.log(1)
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {

      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      console.log(3)

    })
    .then((updatedProductTags) => res.status(200).json([ 1 ]))
    .catch((err) => {
      res.status(400).json(err);
    });
});



router.delete('/:id', async (req, res) => {
  // deletes one product by its `id` value
  try{
    const deleteProduct = await Product.destroy({
      where: {
        id: req.params.id, 
      },
    });
    if (!deleteProduct) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }
    res.status(200).json(deleteProduct);

    } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
