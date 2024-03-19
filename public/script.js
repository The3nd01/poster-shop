var LOAD_NUM = 4;
var watcher

    new Vue({
        el: "#app",
        data: {
            total: 0,
            products: [],
            cart: [],
            search: "cat",
            lastSearch: "",
            loading: false,
            results: [],
        },
        methods: {
            addToCart(product) {
                this.total += product.price;
                var found = false;
                for (var i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === product.id) {
                        this.cart[i].qty++;
                        found = true;
                    }
                }
                if (!found) {
                    this.cart.push({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        qty: 1,
                    });
                }
            },
            inc(item) {
                item.qty++;
                this.total += item.price;
            },
            dec(item) {
                item.qty--;
                this.total -= item.price;
                if (item.qty <= 0) {
                    var i = this.cart.indexOf(item);
                    this.cart.splice(i, 1);
                }
            },
            onSubmit() {
                this.products = [];
                this.results = [];
                var path = "/search?q=".concat(this.search);
                this.loading = true;
                this.$http.get(path).then((response) => {
                    this.results = response.body;
                    this.lastSearch = this.search;
                    this.appendResults()
                    this.loading = false;
                });
            },
            appendResults() {
                if(this.products.length < this.results.length){
                    var toAppend= this.results.slice(this.products.length, LOAD_NUM+this.products.length);
                    this.products = this.products.concat(toAppend)
                }
            },
        },
        filters: {
            currency(price) {
                return price.toFixed(2);
            },
        },
        created() {
            this.onSubmit();
        },
        updated() {
            var sensor = document.querySelector("#product-list-bottom");
            watcher = scrollMonitor.create(sensor);
    
            watcher.enterViewport(this.appendResults);
        },
        beforeUpdate(){
            watcher.destroy()
        }
    });
    

