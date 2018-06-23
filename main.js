Vue.component('product-details', {
	props: {
		details: {
			type: Array,
			required: true
		}
	},
	template: `
	<ul>
		<li v-for="detail in details">{{ detail }}</li>
	</ul>`
})

Vue.component('product', {
	props: {
		premium: {
			type: Boolean,
			required: true
		}
	},
	template: `
	<div class="product">
		<div class="product-image">
			<img v-bind:src="image">
		</div>
		<div class="product-info">
			<h1>{{ title }} <span :class="{sale : isSale}">{{isSale}}</span></h1>
			<p v-if="inStock">In Stock</p>
			<!-- <p v-else-if="inventory < 10 && inventory > 0">Almost sold out</p> -->
			<p v-else>Out of Stock</p>
			<p>Shipping: {{ shipping }}</p>

			<product-details :details="details"></product-details>
			<!-- 
			<ul>
	        	<li v-for="size in sizes">{{ size }}</li>
	        </ul> -->

			<div v-for="(variant, index) in variants" 
				 :key="variant.variantId"
				 class="color-box"
				 :style="{ backgroundColor: variant.variantColor}"
				 @mouseover="updateProduct(index)">
			</div>

			<button v-on:click="addToCart" 
			:disabled="!inStock"
			:class="{ disabledButton: !inStock}">
				Add to cart
			</button>

			<button @click="removeFromCart">
            	Remove from cart
            </button>


		</div>
		
	</div>	
	`,
	data() {
		return {
			brand: 'Vue Mastery',
			product: 'Socks',
			selectedVariant: 0,
			inventory: 100,
			details: ["80% cotton", "20% polyester", "Gender-neutral"],
			variants: [
				{
					variantId: 2234,
					variantColor: "green",
					variantImage: './assets/vmSocks-green.jpg',
					variantQuantity: 10,
					variantSale: true,
				},
				{
					variantId: 2235,
					variantColor: "blue",
					variantImage: './assets/vmSocks-blue.jpg',
					variantQuantity: 0,
					variantSale: false,
				}
			],
			sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
			
		}
	},
	methods: {
		addToCart: function() {
			this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
		},
		removeFromCart: function() {
             this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
		updateProduct: function(index){
			this.selectedVariant = index
		}
	},
	computed: {
		title() {
			return this.brand + ' ' + this.product
		},
		image() {
			return this.variants[this.selectedVariant].variantImage
		},
		inStock() {
			return this.variants[this.selectedVariant].variantQuantity
		},
		isSale(){
          if(this.variants[this.selectedVariant].variantSale){
            return 'SALE!'
          }
        },
        shipping(){
        	if (this.premium){
        		return "Free"
        	}
        	else{
        		return 2.99
        	}
        }
	}
})

var app = new Vue({
	el: '#app',
	data: {
		premium: true,
		cart: []
	},
	methods: {
		updateCart(id) {
			this.cart.push(id)
		},
		removeItem(id) {
          for(var i = this.cart.length - 1; i >= 0; i--) {
            if (this.cart[i] === id) {
               this.cart.splice(i, 1);
            }
          }
        }
	}
})