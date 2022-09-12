const fs = require('fs');
const path = require('path');

const products = require('../data/productsDataBase.json')
const productsFilePath = path.join(__dirname, '../data/productsDataBase.json'); 
const saveProducts = (products) => fs.writeFileSync(productsFilePath, JSON.stringify(products,null,3));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'))
        return res.render('products', { 
            products,
			toThousand
        })
	},

	// Detail - Detail from one product
	detail: (req, res) => {
        const {id} = req.params;

        const product = products.find(product => product.id === +id)

        return res.render('detail',{
            product,
			toThousand
        })
	},

	// Create - Form to create
	create: (req, res) => {
			return res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		
		const {name, price, discount, category, description} = req.body;

		 let lastId = products[products.length - 1].id 

		 let newProduct ={
			id: +lastId +1,
			name,
			price: +price,
			discount: +discount,
			category,
			description, 
			image: "default-image.png"
		 }

		 products.push(newProduct);

		 fs.writeFileSync(path.resolve(__dirname, '..', 'data', 'productsDataBase.json'), JSON.stringify(products,null,3), 'utf-8')

		return res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		const {id} = req.params;

        const product = products.find(product => product.id === +id)
		return res.render('product-edit-form',{
			product
		})
	},
	// Update - Method to update
	update: (req, res) => {
		const {name, price, discount, category, description} = req.body;
		const {id} = req.params;

		const productsModify = products.map(product =>{
			if(product.id === +id){
				let productEdit = {
					...product,
					name,
					price: +price,
					discount: +discount
				 } 
				 return productEdit
		 
			} return product
		})
		

		 fs.writeFileSync(path.resolve(__dirname, '..', 'data', 'productsDataBase.json'), JSON.stringify(productsModify,null,3), 'utf-8') 
 
	   return res.redirect('/')
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {

		const {id} = req.params;

        const product = products.filter(product => product.id !== +id)

		fs.writeFileSync(productsFilePath, JSON.stringify(product,null,3));
		return res.redirect('/')
	}
};

module.exports = controller;