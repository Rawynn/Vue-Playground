var app = new Vue({
	el: '#app',
	data: {
		brand: 'Vue Mastery',
		product: 'Socks',
		image: './assets/vmSocks-green.jpg',
		inventory: 100,
		inStock: true,
		details: ["80% cotton", "20% polyester", "Gender-neutral"],
		variants: [
			{
				variantId: 2234,
				variantColor: "green",
				variantImage: './assets/vmSocks-green.jpg'
			},
			{
				variantId: 2235,
				variantColor: "blue",
				variantImage: './assets/vmSocks-blue.jpg'
			}
		],
		sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
		cart: 0
	},
	methods: {
		addToCart: function() {
			this.cart += 1
		},
		updateProduct :function(variantImage){
			this.image = variantImage
		}
		/* not all browsers support this
		addToCart() {
			this.cart += 1
		},
		updateProduct(variantImage){
			this.image = variantImage
		}
		*/
	},
	computed: {
		title() {
			return this.brand + ' ' + this.product
		}
	}
})