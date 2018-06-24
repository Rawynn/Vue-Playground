Vue.config.devtools = true

var eventBus = new Vue()

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

		<product-tabs :reviews="reviews"></product-tabs>
		
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
			reviews: []
			
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
        },
        mounted(){
        	eventBus.$on('review-submitted', productReview => {
        		this.reviews.push(productReview)
        	})
        }
	}
})

Vue.component('product-review', {
	template: `
	<form class="review-form" @submit.prevent="onSubmit">
	  <p v-if="errors.length">
	  	<b>Please correct the following error(s):</b>
	  	<ul>
			<li v-for="error in errors">{{ error }}</li>
	  	</ul>
	  </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>
      	<h2>Would you recommend this product?</h2>
		<label>
		  <input type="radio" value="Yes" v-model="recommend"> Yes
		</label>
		<label>
		  <input type="radio" value="I don't know" v-model="recommend"> I don't know
		</label>
		<label>
		  <input type="radio" value="No" v-model="recommend"> No
		</label>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
	`,
	data() {
		return{
			name: null,
			review: null,
			rating: null,
			errors: [],
			recommend: null
		}
	},
	methods: {
		onSubmit(){
			if(this.name && this.review && this.rating && this.recommend){
				let productReview = {
				name: this.name,
				review: this.review,
				rating: this.rating,
				recommend: this.recommend
				}
				eventBus.$emit('review-submitted', productReview)
				this.name = null
				this.review = null
				this.rating = null
				this.recommend = null
			}
			else{
				if(!this.name) this.errors.push("Name required.")
				if(!this.review) this.errors.push("Review required.")
				if(!this.rating) this.errors.push("Rating required.")
				if(!this.recommend) this.errors.push("Recommendation required.")	
			}
			
		}
	}
})

Vue.component('product-tabs', {
	props: {
		reviews: {
			type: Array,
			required: true
		}	
	},
	template: `
		<div>
			<span class="tab"
				  :class="{activeTab: selectedTab === tab}"
				  v-for="(tab, index) in tabs" 
				  :key="index"
				  @click="selectedTab = tab">
				  {{ tab }}
			</span>
		

			<div v-show="selectedTab === 'Reviews'">
				<p v-if="!reviews.length">There are no reviews yet.</p>
				<ul>
					<li v-for="review in reviews">
						<p>{{ review.name }}</p>
						<p>Rating: {{ review.rating }}</p>
						<p>{{ review.review }}</p>
						<p>Recommend it? {{ review.recommend }}</p>
					</li>
				</ul>
			</div>

			<product-review v-show="selectedTab === 'Make a Review'">
			</product-review>
		</div>
	`,
	data(){
		return {
			tabs: ['Reviews', 'Make a Review'],
			selectedTab: 'Reviews'
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