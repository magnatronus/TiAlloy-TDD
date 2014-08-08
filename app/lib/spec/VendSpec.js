/**
 * A Jasmine Test Spec for the lib.vend module
 * 
 * @class spec.VendSpec
 */
var Vend = require('vend');

describe("The Vending Machine", function() {

  	var machine;

	beforeEach(function(){
		machine = new Vend([2,1,0.5,0.2,0.1,0.05,0.02,0.01]);
		machine.restock('chocolate', 0, 1.85);
		machine.restock('crisps', 2, 0.75);
	});
	

	describe('can have money added to it', function(){
	
		it("should accept a £2.00 coin",function(){
			expect(machine.addCoin('2.00')).toBe(true);	
		});
	
		it("should NOT accept a 3p coin",function(){
			expect(machine.addCoin('0.03')).toBe(false);	
		});
		
		it("shows the money deposited as £2.86", function(){
		
			machine.addCoin(2);
			machine.addCoin(0.5);
			machine.addCoin(0.2);
			machine.addCoin(0.1);
			machine.addCoin(0.05);
			machine.addCoin(0.01);
		
			expect(machine.balance()).toBe(2.86);	
		
		});
		
		
	});

		
	describe('can be stocked with items to sell', function(){
		
		it("should allow a sandwich to be added showing stock level of 1",function(){
			
			expect(machine.restock('sandwich', 1, 2.35)).toBe(true);
			expect(machine.getStockLevel('sandwich')).toBe(1);
			
		});
			
		it("will vend crisps if in stock with £1.00 added and show balance of 25p",function(){

			machine.addCoin(1);
			expect(machine.buy('crisps')).toBe(true);
			expect(machine.balance()).toBe(0.25);		
		
		});
		
		it("will NOT vend chocolate if not in stock",function(){
	
			machine.addCoin(1);
			expect(function(){
				machine.buy('chocolate');
			}).toThrow('Sorry but the item you have selected is out of stock');
		
		});
		
	});
	

});
