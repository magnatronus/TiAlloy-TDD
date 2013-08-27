/**
 * vend.js
 * 
 * a common js module to simulate a simple vending machine
 * @author: steve rogers (www.spiralarm.co.uk)
 *  
 * Friday 16 Aug 2013
 * 
 * This code is copyright Steve Rogers 2013
 * 
 * Unless required by applicable law or agreed to in writing, this software
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
 * either express or implied.
 *
 * 27 Aug 2013 - Updated version after Unit Testing with TiAlloy-TDD
 * 
 */


/**
 * Create a machine by passing in the array of acceptable coin values
 * @param {Object} coins
 */
function machine(coins){

	var $ = this;
	$.coins = coins;
	$.transaction = 0;
	
	// track our machine stock
	$.stock = [];	
	
  	/**
  	 * Buy an Item
  	 */
  	$.buy = function(name){
  		
  		var bought = false;
  		
  		// get item from stock
  		var stockitem = $.stock[name];
  		if(stockitem.quantity<1){
  			throw new Error('Sorry but the item you have selected is out of stock');
  		}
  		else{
  		
  			//check there is enough money in to pay for selection
  			if($.transaction<stockitem.cost){
  				var shortfall = stockitem.cost - $.transaction;
  				throw new Error('You need to add £' + shortfall.toFixed(2) + ' to buy this selection');
  			}
  			else{
  				$.stock[name].quantity -=1;
  				$.transaction -= stockitem.cost;
  				bought = true;
  			}
  			
  		}
  		
  		return bought;
  		
  	}; 
  	
  	
  	/**
  	 * Restock machine
  	 */
  	$.restock = function(name,quantity,cost){
  		$.stock[name] = {quantity: quantity, cost:cost};
  		return true; 		
   	};
  	
  	
  	/**
  	 * Get current stock information
  	 */
  	$.list = function(){
  		return $.stock;	
  	};
  	
  	
  	/**
  	 * Get the stock level of a specific item
  	 */
  	$.getStockLevel = function(name){
  		return $.stock[name].quantity;	
  	};
    	
    /**
     * Add a money to the machine
     */	
	$.addCoin = function(money){
		
		var coin = parseFloat(money);
		if($.coins.indexOf(coin)!=-1){
			$.transaction += coin;
			return true;	
		}
		else{
			return false;
		}	
		
	};
	
	/**
	 * Refund any money owed
	 */
	$.refund = function(){
		
		// generate the refund with the correct coin values
		var wallet = [];
		$.coins.sort(function(a,b){return b-a;});
		for(var i=0; i<$.coins.length; i++){
			var coin = $.coins[i];			
			var coincount = Math.floor($.transaction.toFixed(2)/coin);
			if(coincount>0){
				$.transaction -= (coin * coincount);
				wallet.push({coin: coin, count:coincount});
			}
		}
		
		// zero our balance
		$.transaction = 0;
				
		// give back the change
		return wallet;
			
	};
	
	/**
	 * Get current coin balance in machine
	 */
	$.balance = function(){
		return parseFloat($.transaction.toFixed(2));
	};
		
	
}




/**
 * Export our module functionality
 */
module.exports = machine;
