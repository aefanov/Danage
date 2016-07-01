var imgDomains = new Array();
PageNo="Side";
PageOf="af";
NextPageText ="";
PrevPageText ="";
cId=54;
contId=11;
customerId=0;
rp=72;
so=7;
weightBeforeZipCode=200000;

(function (m, $) {

	this.JsonProductList = function (selector, serviceUrl, testMode) {
		selector = "#" + selector;
		var getUrl = '';
        var filters = {};
        this.loadCompleted = 'JsonProductListLoadCompleted';
        this.jsonData = null;
        var me = this;
        this.fetchEarly = false;

		goToPage(serviceUrl);

		function parseJSON(jsondata,append){
			if(!jsondata.data.items){
				return;
			}
			me.jsonData = jsondata.data;
			var divList
			if(!append){
				if($('#frontPageProductsBdy.jsonProducts').length > 0 || $('#frontPageProductsMostSoldBdy.jsonProducts').length > 0 || $('#basketProductsBdy.jsonProducts').length > 0 || $('#frontPageProductsGoodBuyBdy.jsonProducts').length > 0 || $('#frontPageProductsCurrentBdy.jsonProducts').length > 0){
					divList = $("<div></div>");
					divList.addClass('products');
				}
				else {
					if($('.buildABowOuterDiv').length > 0) {
						divList = $("<ul class='products small-block-grid-1 medium-block-grid-3 large-block-grid-4'></ul>");
					}
					else {
						divList = $("<ul class='products small-block-grid-2 medium-block-grid-3 large-block-grid-4'></ul>");
					}
				}
				$(selector).empty();
				$(selector).append(divList);
			}
			else {
				divList = $(selector + " > div.products");
			}

			var productCount=0;
			$.each(jsondata.data.items, function(key, val) {

				//Make sure to get the correct stock message
				var deliveryData = "nothing";
				var hasExpectedDelivery = 'false';

				if(val.inventoryCountFormatted >= 1) {
					deliveryData = val.inStockMessage;
					hasExpectedDelivery = 'false';
				}
				if(val.inventoryCountFormatted <= 0) {
					if(val.hasExpectedDeliveryDate == true) {
						deliveryData = val.expectedDeliveryDateFormatted;
						hasExpectedDelivery = 'true';
					}
					else {
						deliveryData = val.notInStockMessage ;
						hasExpectedDelivery = 'false';
					}
				}

				//Get the main image url from the product, and if no image is found load the no image replacement
				var imgsrc = "";
				if(val.images[0]){
					imgsrc = val.images[0].url.replace(/sizeId=([0-9]+)/,"sizeId=5884");
				}
				else
				{
					imgsrc = "/SL/SI/695/7e8d0f1e-58b2-4bcb-a41d-d124a29c18fc.jpg";
				}

				//Create the add to basket button
				var addToBasketData = "";
				var addToBasketTxt = "Send forespørgsel";

				basketQtyInput = $('<input></input>')
				basketQtyInput.attr('value', '1');
				basketQtyInput.attr('type', 'tel');
				basketQtyInput.addClass('basketQtyInput');

				if(val.showAddToBasket = "true") {
					if(val.isBuyable = "true") {
						basketDiv = $("<div></div>");
						basketDiv.click(function(){

							var getQtyAmount = $(this).parent().children('input.basketQtyInput').val();

							if(val.grossWeightFormatted >= weightBeforeZipCode) {
								ActivateBasketButtonPrompt(val.eSellerId,0,'',1,'GET',encodeURIComponent(window.location.pathname + window.location.search),false,true,val.expectedDeliveryDateFormatted);
							}
							else {
								atbNoQty(val.eSellerId, 0, 1, '', '', '', '', encodeURIComponent(window.location.pathname + window.location.search));
							}
						});
						basketDiv.addClass("addToBasketLnk");
						basketDiv.text(addToBasketTxt);
					}
				}

				if($('#frontPageProductsBdy.jsonProducts').length > 0){
					productDiv = $("<div></div>");
				}
				else {
					productDiv = $("<li></li>");
				}
				productDiv.addClass("productElement");
				if($('.buildABowOuterDiv').length > 0) {
					productDiv.addClass('productElementBuilder');
				}

				if($('.searchResultsProductsOuterBdy').length > 0){

					var eSellerIDstring = val.eSellerId;
					eSellerIDstring = eSellerIDstring.toString();

					if(jQuery.inArray(eSellerIDstring, getAllSearchProductsIDsArray) !== -1) {

						var sortOrderValue = getAllSearchProductsIDsArray[($.inArray(eSellerIDstring, getAllSearchProductsIDsArray) + 1) % getAllSearchProductsIDsArray.length];
						productDiv.attr('id', sortOrderValue);

					}
					else {
						console.log('is not in array');
					}
				}

				productInnerDiv = $('<div></div>');
				productInnerDiv.addClass('productInnerDiv');
				productImageDiv = $("<div></div>");
				productImageDiv.addClass("productImage");
				productLink = $("<a></a>");
				if($('.buildABowOuterDiv').length === 0) {
					productLink.attr("href",val.URLPathAndQuery);
				}
				productImg = $("<img></img>");
				productImg.attr("src", imgsrc);
				productImg.attr("alt", val.name);
				productLink.append(productImg);
				productImageDiv.append(productLink);
				productInnerDiv.append(productImageDiv);

                productnameDiv = $("<div></div>");
                productnameDiv.addClass("productName");
                productNameLnk = $("<a></a>");
                productNameLnk.attr("href",val.URLPathAndQuery);
                productNameLnk.text(val.name);
                productnameDiv.append(productNameLnk);
                productInnerDiv.append(productnameDiv);

				stockStatusDiv = $('<div></div>');
				stockStatusDiv.addClass('stockStatusDiv');
				if(val.boundToInventoryCount == true) {
					if(val.inventoryCount > 0) {
						stockStatusDiv.append('<span class="onStockIcon"></span>' + '<span class="stockText">' + productOnStockText + '</span>');
					}
					else {
						stockStatusDiv.append('<span class="nonStockIcon"></span>' + '<span class="stockText">' + productNotStockText + '</span>');
					}
				}
				productInnerDiv.append(stockStatusDiv);

				if($('.buildABowOuterDiv').length === 0) {
					productItemNumber = $('<a></a>');
					productItemNumber.attr('href', val.URLPathAndQuery);
	                productItemNumber.addClass('productItemNumberLnk');
					productItemNumber.append(productItemNumberText + ': ' +val.id);
					productInnerDiv.append(productItemNumber);
				}
				else {
					customFieldsDiv = $('<div></div>');
					customFieldsDiv.addClass('customFieldsDiv');

					//Handling model div
					customFieldModelDiv = $('<div></div>');
					customFieldModelDiv.addClass('customFieldModelDiv');
					customFieldModelHeader = $('<span></span>');
					customFieldModelHeader.append(customFieldModelHeaderText + ": ");
					customFieldModelHeader.addClass('customFieldModelHeader');
					customFieldModelValue = $('<span></span>');
					customFieldModelValue.append(val.customFields[customFieldModelHeaderText]);
					customFieldModelValue.addClass('customFieldModelValue');
					customFieldModelDiv.append(customFieldModelHeader);
					customFieldModelDiv.append(customFieldModelValue);
					customFieldsDiv.append(customFieldModelDiv);

					//Handling size div
					customFieldSizeDiv = $('<div></div>');
					customFieldSizeDiv.addClass('customFieldSizeDiv');
					customFieldSizeHeader = $('<span></span>');
					customFieldSizeHeader.append(customFieldSizeHeaderText + ": ");
					customFieldSizeHeader.addClass('customFieldSizeHeader');
					customFieldSizeValue = $('<span></span>');
					customFieldSizeValue.append(val.customFields[customFieldSizeHeaderText]);
					customFieldSizeValue.addClass('customFieldSizeValue');
					customFieldSizeDiv.append(customFieldSizeHeader);
					customFieldSizeDiv.append(customFieldSizeValue);
					customFieldsDiv.append(customFieldSizeDiv);

					//Handling color div
					customFieldColorDiv = $('<div></div>');
					customFieldColorDiv.addClass('customFieldColorDiv');
					customFieldColorHeader = $('<span></span>');
					customFieldColorHeader.append(customFieldColorHeaderText + ": ");
					customFieldColorHeader.addClass('customFieldColorHeader');
					customFieldColorValue = $('<span></span>');
					customFieldColorValue.append(val.customFields[customFieldColorHeaderText]);
					customFieldColorValue.addClass('customFieldColorValue');
					customFieldColorDiv.append(customFieldColorHeader);
					customFieldColorDiv.append(customFieldColorValue);
					customFieldsDiv.append(customFieldColorDiv);

					//Handling length div
					customFieldLengthDiv = $('<div></div>');
					customFieldLengthDiv.addClass('customFieldLengthDiv');
					customFieldLengthHeader = $('<span></span>');
					customFieldLengthHeader.append(customFieldLengthHeaderText + ": ");
					customFieldLengthHeader.addClass('customFieldLengthHeader');
					customFieldLengthValue = $('<span></span>');
					customFieldLengthValue.append(val.customFields[customFieldLengthHeaderText]);
					customFieldLengthValue.addClass('customFieldLengthValue');
					customFieldLengthDiv.append(customFieldLengthHeader);
					customFieldLengthDiv.append(customFieldLengthValue);
					customFieldsDiv.append(customFieldLengthDiv);

					//Handling pull div
					customFieldPullDiv = $('<div></div>');
					customFieldPullDiv.addClass('customFieldPullDiv');
					customFieldPullHeader = $('<span></span>');
					customFieldPullHeader.append(customFieldPullHeaderText + ": ");
					customFieldPullHeader.addClass('customFieldPullHeader');
					customFieldPullValue = $('<span></span>');
					customFieldPullValue.append(val.customFields[customFieldPullHeaderText]);
					customFieldPullValue.addClass('customFieldPullValue');
					customFieldPullDiv.append(customFieldPullHeader);
					customFieldPullDiv.append(customFieldPullValue);
					customFieldsDiv.append(customFieldPullDiv);

					//Handling hand div
					customFieldHandDiv = $('<div></div>');
					customFieldHandDiv.addClass('customFieldHandDiv');
					customFieldHandHeader = $('<span></span>');
					customFieldHandHeader.append(customFieldHandHeaderText + ": ");
					customFieldHandHeader.addClass('customFieldHandHeader');
					customFieldHandValue = $('<span></span>');
					customFieldHandValue.append(val.customFields[customFieldHandHeaderText]);
					customFieldHandValue.addClass('customFieldHandValue');
					customFieldHandDiv.append(customFieldHandHeader);
					customFieldHandDiv.append(customFieldHandValue);
					customFieldsDiv.append(customFieldHandDiv);

					productInnerDiv.append(customFieldsDiv);
					productInnerDiv.append(basketDiv);
				}

                productPriceDiv = $('<a></a>');
                productPriceDiv.attr('href', val.URLPathAndQuery);
                productPriceDiv.addClass('productPriceDiv');
                if(val.hasSalesPrice.length != 0) {
                    if(!val.hasSalesPrice == false) {
                        productPriceDiv.append(val.salesPrices[0].tagPriceFormatted);
                    }
                }
                productInnerDiv.append(productPriceDiv);

				productPrevPriceDiv = $('<a></a>');
                productPrevPriceDiv.attr('href', val.URLPathAndQuery);
                productPrevPriceDiv.addClass('productPrevPriceDiv');
                if(val.hasSalesPrice.length != 0) {
                    if(val.hasSalesPrice == true) {
                        if(!val.salesPrices[0].hasPreviousPrice == false) {
                            productPrevPriceDiv.append(val.salesPrices[0].previousTagPriceFormatted);
                        }
                    }
                }
                productInnerDiv.append(productPrevPriceDiv);

				if($('#favoriteProductsJsonBdy').length > 0){
					productInnerDiv.append(basketQtyInput);
                	productInnerDiv.append(basketDiv);
					productRemoveFromFavorites = $('<a></a>');
					productRemoveFromFavorites.append('X');
					productRemoveFromFavorites.addClass('productRemoveFromFavorites');
					productRemoveFromFavorites.attr('href', $('.plistAreaHeader .Tabular .ProductID a:contains("'+val.eSellerId+'")').parent().parent().children('td').children('.remfav').children('a').attr('href'));
					productInnerDiv.append(productRemoveFromFavorites);
				}
				else {
					//productInnerDiv.append(basketQtyInput);
                	//productInnerDiv.append(basketDiv);
				}

                if(val.greatBuy != false) {
                    goodDeal = $('<a></a>');
                    goodDeal.attr('href', val.URLPathAndQuery);
                    goodDeal.addClass('goodDeal');
                    goodDeal.append(goodDealTextVar);
                    productInnerDiv.append(goodDeal);
                }

                if(val.deprecated != false) {
                    deprecatedProduct = $('<a></a>');
                    deprecatedProduct.attr('href', val.URLPathAndQuery);
                    deprecatedProduct.addClass('deprecatedProduct');
                    deprecatedProduct.append(deprecatedTextVar);
                    productInnerDiv.append(deprecatedProduct);
                }

				if(val.noveltyProduct != false) {
                    noveltyProduct = $('<a></a>');
                    noveltyProduct.attr('href', val.URLPathAndQuery);
                    noveltyProduct.addClass('noveltyProduct');
                    noveltyProduct.append(noveltyProductTextVar);
                    productInnerDiv.append(noveltyProduct);
                }

                productDiv.append(productInnerDiv);
                $(selector + " > .products").append(productDiv);

            });

			//Check if related products has products if yes then show
			if($('#relatedProductsList').length > 0) {
				if($('#relatedProductsList .productElement').length > 0) {
					$('#relatedProductsList').parent().show();
					$('#relatedProductsList').show();
				}
			}

			//Check if good buy products has products if yes then show
			if($('#goodMatchProductsList').length > 0) {
				if($('#goodMatchProductsList .productElement').length > 0) {
					$('#goodMatchProductsList').parent().show();
				}
			}

			//Make sure we remeber to sort the productlist gained on the search result page
			//And to show header when there are items
			if($('.searchResultsProductsOuterBdy').length > 0){
				tinysort('#searchResultsProductsBdy ul li',{attr: 'id'});
				if($('#searchResultsProductsBdy .productElement').length > 0) {
					$('.productsHeader h2').show();
				}

				if($('.searchResultsMenusBdy .prmain').length > 0) {
					$('.menusHeader h2').show();
				}
			}

			updateUrl();

            if($('#frontPageProductsBdy.jsonProducts').length > 0){
				var screen = $(window).width();
				if(screen <= 640) {
					$('#frontPageProductsBdy.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 2,
						slidesToScroll: 2,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				}
				else if(screen <= 1025 && screen > 640) {
					$('#frontPageProductsBdy.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 4,
						slidesToScroll: 4,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				}
				else if(screen > 1025) {
					$('#frontPageProductsBdy.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 5,
						slidesToScroll: 5,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				};
            }

			if($('#frontPageProductsMostSoldBdy.jsonProducts').length > 0){
				var screen = $(window).width();
				if(screen <= 640) {
					$('#frontPageProductsMostSoldBdy.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 2,
						slidesToScroll: 2,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				}
				else if(screen <= 1025 && screen > 640) {
					$('#frontPageProductsMostSoldBdy.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 4,
						slidesToScroll: 4,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				}
				else if(screen > 1025) {
					$('#frontPageProductsMostSoldBdy.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 5,
						slidesToScroll: 5,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				};
            }

			if($('#basketProductsBdy.jsonProducts').length > 0){
				var screen = $(window).width();
				if(screen <= 640) {
					$('#basketProductsBdy.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 2,
						slidesToScroll: 2,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				}
				else if(screen <= 1025 && screen > 640) {
					$('#basketProductsBdy.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 4,
						slidesToScroll: 4,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				}
				else if(screen > 1025) {
					$('#basketProductsBdy.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 5,
						slidesToScroll: 5,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				};
            }

			if($('#goodMatchProductsList.jsonProducts').length > 0){
				var screen = $(window).width();
				if(screen <= 640) {
					$('#goodMatchProductsList.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 2,
						slidesToScroll: 2,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				}
				else if(screen <= 1025 && screen > 640) {
					$('#goodMatchProductsList.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 4,
						slidesToScroll: 4,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				}
				else if(screen > 1025) {
					$('#goodMatchProductsList.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 5,
						slidesToScroll: 5,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				};
            }

			if($('#relatedProductsList.jsonProducts').length > 0){
				var screen = $(window).width();
				if(screen <= 640) {
					$('#relatedProductsList.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 2,
						slidesToScroll: 2,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				}
				else if(screen <= 1025 && screen > 640) {
					$('#relatedProductsList.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 4,
						slidesToScroll: 4,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				}
				else if(screen > 1025) {
					$('#relatedProductsList.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 5,
						slidesToScroll: 5,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				};
            }

			if($('#frontPageProductsGoodBuyBdy.jsonProducts').length > 0){
				var screen = $(window).width();
				if(screen <= 640) {
					$('#frontPageProductsGoodBuyBdy.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 2,
						slidesToScroll: 2,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				}
				else if(screen <= 1025 && screen > 640) {
					$('#frontPageProductsGoodBuyBdy.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 4,
						slidesToScroll: 4,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				}
				else if(screen > 1025) {
					$('#frontPageProductsGoodBuyBdy.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 5,
						slidesToScroll: 5,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				};
            }

			if($('#frontPageProductsCurrentBdy.jsonProducts').length > 0){
				var screen = $(window).width();
				if(screen <= 640) {
					$('#frontPageProductsCurrentBdy.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 2,
						slidesToScroll: 2,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				}
				else if(screen <= 1025 && screen > 640) {
					$('#frontPageProductsCurrentBdy.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 4,
						slidesToScroll: 4,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				}
				else if(screen > 1025) {
					$('#frontPageProductsCurrentBdy.jsonProducts .products').slick({
						infinite: true,
						arrows: true,
						slidesToShow: 5,
						slidesToScroll: 5,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				};
            }

            prefetch = $("<link></link>");
            prefetch.attr("rel","prefetch");
            if(jsondata.data.previousLink && jsondata.data.previousLink.length>0){
				prefetch.attr("href",document.location.protocol + "//" + document.location.hostname + jsondata.data.previousLink);
				prefetch.appendTo("head");
			}
			if(jsondata.data.nextLink && jsondata.data.nextLink.length>0){
				prefetch.attr("href",document.location.protocol + "//" + document.location.hostname + jsondata.data.nextLink);
				prefetch.appendTo("head");
			}

        }

        function goToPage(url) {

            getUrl = url;
			fetchEarly = false;
			if(getUrl.indexOf("p=1&")!=-1&&getUrl.indexOf("rp=72")==-1){
				fetchEarly = true;
			}
			if(getUrl.indexOf("RelatedProducts")!=-1){
				fetchEarly = true;
			}
			if(fetchEarly){

				getUrlEarly = getUrl.replace(/rp=([0-9](.?)\&)/,"rp=72&");
				if(getUrl.indexOf("RelatedProducts")!=-1){
					getUrlEarly = getUrl + "&maxResults=4";
				}
				//console.log("Before replace" + getUrl);
				//console.log("After replace" + getUrlEarly);
				$.ajax({
				  url: getUrlEarly,
				  dataType: 'json',
				  async: true,
				  success: function(jsondata) {
					parseJSON(jsondata,false);
					//Update the pager with current results
					setPager(jsondata.data.pageNumber, jsondata.data.previousLink, jsondata.data.nextLink, jsondata.data.totalPages);

					$(document).trigger(me.loadCompleted, { data: jsondata.data, error: jsondata.error });

				  }
				});
			}

			if(location.pathname=="/"||location.pathname=="" || location.href.indexOf("/pi/")!=-1){

			}
			else {
				$.getJSON(url, function(jsondata) {
					if($("div.plist").html() && $("div.plist").html().length>10){
						//ensure that if the second call is faster than the first one, the productlist is overwritten
						fetchEarly=false;
					}
					parseJSON(jsondata,fetchEarly);
					//Update the pager with current results
					setPager(jsondata.data.pageNumber, jsondata.data.previousLink, jsondata.data.nextLink, jsondata.data.totalPages);
					$(document).trigger(me.loadCompleted, { data: jsondata.data, error: jsondata.error });
				})
				.fail(function() {
					//console.log("Parse or network error");
					$("#loaderDiv").text("");
				});}
		}

		function setPager(currentPage, previousPage, nextPage, totalPages) {
            if(!$("div.pager")||$("div.pager").length<1){
                plist = $("<div></div>");
                plist.addClass("pager");
                plist.addClass("clearfix");
                plist2 = plist.clone();
                $(".jsonProducts").prepend(plist);
                $(".jsonProducts").append(plist2);
            }
            var target = $("div.pager");
            target.empty();
            if (previousPage && previousPage.length > 0) {
                var pageLink = $("<a href='javascript:void(0);' class='previousPageLnk active' data-URLPathAndQuery='" + previousPage + "'><span class='icon prev'></span>" + PrevPageText + "</a></div>");
                pageLink.click(function () {
                    $(window).scrollTop(0);
                    //jQuery.bbq.pushState("page="+getUrlVars(previousPage)["p"]);
                    goToPage(previousPage.replace("&imgSizeId=0",""));
                });
                target.append(pageLink);
            }
            else {
                var pageLink = $("<a href='javascript:void(0);' class='previousPageLnk notActive' data-URLPathAndQuery='" + previousPage + "'><span class='icon prev'></span>" + PrevPageText + "</a></div>");
                target.append(pageLink);
            }


			if(currentPage && totalPages){
				pagecount = $("<span class='pagecountspan'></span>");
				pagecount.text(PageNo + " " + currentPage + " " + PageOf + " " + totalPages);
                multipage = $("<span></span>");
                multipage.addClass('multipageBdy');

                for(i=1;i<=totalPages;i++){
                    pagelink = $("<span></span>");
                    pagelink.attr("data-index",i)
                    pagelink.attr("data-currentPage",productList);
                    pagelink.text(i);
                    if(i==currentPage){
                        pagelink.addClass("currentpage");
                    }
                    pagelink.click(function(){
                        //alert($(this).attr("data-index"));
                        //jQuery.bbq.pushState("page="+$(this).attr("data-index"));
                        goToPage($(this).attr("data-currentPage").replace($(this).attr("data-currentPage").match(/&p=([0-9]{1,2})/)[0],"&p=" + $(this).attr("data-index")));
                    });
                    multipage.append(pagelink);
                }
                target.append(multipage);
                target.append(pagecount);
			}


            if (nextPage && nextPage.length > 0) {
                var nextLink = $("<a href='javascript:void(0);' class='nextPageLnk' data-URLPathAndQuery='" + nextPage + "'>" + NextPageText + "<span class='icon next'><div style='clear:both;'></div></span></a>");
                nextLink.click(function () {
                    $(window).scrollTop(0);
                    //jQuery.bbq.pushState("page="+getUrlVars(nextPage)["p"]);
                    goToPage(nextPage.replace("&imgSizeId=0",""));
                });
                target.append(nextLink);
            }


         target.first().addClass("first");
         target.last().addClass("last");

            if(totalPages <= 1) {
                $('.jsonProducts .pager').hide();
            }
            else {
                $('.jsonProducts .pager').show();
            }

            //if(totalPages == "1") {
              //  $('.jsonProducts .pager').remove();
            //}

        }
        function getUrlVars(url) {
            var vars = {};
            var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi,
            function(m,key,value) {
            vars[key] = value;
            });
            return vars;
        }
        /*
        Handles loading of next page
        */


				    this.SetFilters = function (key, values) {
            filters[key] = values;
            updateUrl();
            goToPage(getUrl);
        };
        this.SetSorting = function (option) {
            sortingOption = option;
            updateUrl();
            goToPage(getUrl);
        };
        var sortingOption = "";

        this.SetResultsPerPage = function (option) {
            rpOption = option;
            updateUrl();
            goToPage(getUrl);
        };

        var rpOption = "";
            this.updateUrl = function() {
            var params = getUrlParts(getUrl);

            for (var key in filters) {
                var val = "";
                if (filters[key]) {
                    val = filters[key];
                }

                var filterKey = "";
                var i = 1;
                for (i; i < 100; i++) {
                    filterKey = "fn" + i;
                    if (params[filterKey] && params[filterKey] != key) {
                        continue;
                    } else {
                        break;
                    }
                }
                params[filterKey] = key;
                params["fv" + i] = val;

            }

				params["so"] = sortingOption;
				if(rpOption){
					params["rp"] = rpOption;
				}
				getUrl = getPathFromUrl(getUrl) + "?" + $.param(params);
			}

        function getPathFromUrl(url) {
            return url.split("?")[0];
		}
	};
})({}, jQuery);
var splashurl = '';
$j(document).ready(function() {
	var productsCount = 0;
	$(document).bind(window.jsonProductList.loadCompleted, function(e, data){
		if (data.data && data.data.totalProducts > 0){
			$('.sortingContainer').attr('style', '');
		}
		else {
			$('.sortingContainer').attr('style', 'display:none!important;')
			$('.listEmpty').attr('style', 'display:block!important;')
		}
	});
	if (productsCount == 0){
		$('.sortingContainer').attr('style', 'display:none!important;');
	}
	$('.sortingContainer').attr('style', '');

	$("div.pager").next("br").remove();
	$("div.plist").next("br").remove();

	$('#changeSortOrderBdy div').text($('#sortAZ').text());
});

page=1;

//Filters
var customFieldCount = 1;
//Price Filters
var filterUrl = "";
if($("input[name$='tbxMinPrice']").length>0 && $("input[name$='tbxMaxPrice']").length>0){
	filterUrl += "&fn1=ProductPrice&fv1=" + $("input[name$='tbxMinPrice']").val() + '^' + $("input[name$='tbxMaxPrice']").val();
}
//Manufacture Filters
var manufactureFilter = "&fn2=ProductManufacturer&fv2=";
if($('#productFilteringDrop').length > 0) {
	if($('#productFilteringDrop .productFilteringManufacture ul li').children('input[type="checkbox"]:checked').length > 0) {
		$( "#productFilteringDrop .productFilteringManufacture ul li" ).each(function( index ) {
			if($(this).children('input[type="checkbox"]:checked').length > 0) {
				manufactureFilter += $(this).children('input[type="checkbox"]:checked').val();
				manufactureFilter += "^";
			}
		});
		customFieldCount++;
		manufactureFilter = manufactureFilter.substring(0, manufactureFilter.length - 1);
		filterUrl += manufactureFilter;
	}
}
//Customfield Filters
var customFieldFilter = "";
if($('ul.sortingOuterDiv li').length > 0) {
	if($('.sortingOuterDiv li').children('input[type="checkbox"]:checked').length > 0) {
		$( ".sortingOuterDiv li" ).each(function( index ) {
			if($(this).children('input[type="checkbox"]:checked').length > 0) {
				customFieldFilter += "&fn"+customFieldCount+"=CustomFields&fk"+customFieldCount+"="+ $(this).parent().parent().parent().attr('data-filtername') +"&fv"+customFieldCount+"=";
				customFieldFilter += $(this).children('input[type="checkbox"]:checked').val();
				customFieldFilter += "^";
				customFieldCount++;
			}
		});
		customFieldFilter = customFieldFilter.substring(0, customFieldFilter.length - 1);
		filterUrl += customFieldFilter;
		//console.log(filterUrl);
	}
}

var productList = "";
var targetelement = $(".jsonProducts").attr("id");

if(location.href.indexOf("/pl/")!=-1){
	productList = '/Services/ProductService.asmx/ProductList?v=1.0&lId=0&locId=' + locId + '&so=' + so + '&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&customerId=' + customerId + '&mId=' + mId + '&p=' + page + '&rp=' + rp;
}

if($('.productInfoBdy .relatedProducts').length > 0){
	productList = '/Services/ProductService.asmx/RelatedProducts?v=1.0&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&customerId=' + customerId + '&imgSizeId=0&pId=' + pId;
}

if($('.frontPageProducts').length > 0){
	productList = '/Services/ProductService.asmx/ProductList?v=1.0&lId=0&so=' + so + '&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&locId=' + locId + '&customerId=0&mId=&p=1&rp=50&imgSizeId=0&fn1=CustomFields&fk1=3&fv1=True';
	targetelement = $(".frontpageNews").attr("id");
}

if($('.basketProducts').length > 0){
	productList = '/Services/ProductService.asmx/ProductList?v=1.0&lId=0&so=' + so + '&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&locId=' + locId + '&customerId=0&mId=&p=1&rp=72&imgSizeId=0&fn1=CustomFields&fk1=1&fv1=True';
}

if($('.searchResultsProductsOuterBdy').length > 0){
	productList = '/Services/ProductService.asmx/Products?v=1.0&cId=54&langId=1&so=0&countryId=11&locId=&customerId=0&imgSizeId=0&pIds=';
	productList += getAllSearchProductsIDs;
}

if($('#favoriteProductsJsonBdy').length > 0){
	productList = '/Services/ProductService.asmx/Products?v=1.0&cId=54&langId=1&so=0&countryId=11&locId=&customerId=0&imgSizeId=0&pIds=';
	productList += getAllFavoriteProductIDs;
}

productList += filterUrl;
productList += '&serial=' + serial;
jsonProductList = new JsonProductList(targetelement, productList, true);
function ChangeCurrentLanguage(oSelect){
	window.location.href=window.location.pathname + '?' + pageQuery.toString();
}

function updateUrl(){
    targetelement = $('.jsonProducts').attr('id');
    $('.sortingContainer .sortOptions').on('change', function (e) {
        newSortOption = "so=";
        newSortOption += $("option:selected", this).attr('value');
        JsonProductList(targetelement, productList.replace(/so=([0-9]*)/,newSortOption), true);
    });
}

if($('.frontPageProductsGoodBuy').length > 0){
	productList = '/Services/ProductService.asmx/ProductList?v=1.0&lId=0&so=' + so + '&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&locId=' + locId + '&customerId=0&mId=&p=1&rp=50&imgSizeId=0&fn1=CustomFields&fk1=2&fv1=True';
	targetelement = $(".frontpageNewsGoodBuy").attr("id");

	productList += '&serial=' + serial;

	jsonProductList = new JsonProductList(targetelement, productList, true);
	function ChangeCurrentLanguage(oSelect){
		window.location.href=window.location.pathname + '?' + pageQuery.toString();
	}
}

if($('.frontPageProductsCurrent').length > 0){
	productList = '/Services/ProductService.asmx/ProductList?v=1.0&lId=0&so=' + so + '&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&locId=' + locId + '&customerId=0&mId=&p=1&rp=50&imgSizeId=0&fn1=CustomFields&fk1=1&fv1=True';
	targetelement = $(".frontpageNewsCurrent").attr("id");

	productList += '&serial=' + serial;

	jsonProductList = new JsonProductList(targetelement, productList, true);
	function ChangeCurrentLanguage(oSelect){
		window.location.href=window.location.pathname + '?' + pageQuery.toString();
	}
}

if($('.frontPageProductsMostSold').length > 0){
	productList = '/Services/ProductService.asmx/ProductList?v=1.0&lId=0&so=' + so + '&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&locId=' + locId + '&customerId=0&mId=&p=1&rp=50&imgSizeId=0&fn1=CustomFields&fk1=3&fv1=true';
	targetelement = $(".frontpageMostSold").attr("id");

	productList += '&serial=' + serial;

	jsonProductList = new JsonProductList(targetelement, productList, true);
	function ChangeCurrentLanguage(oSelect){
		window.location.href=window.location.pathname + '?' + pageQuery.toString();
	}
}

if($('.productsGoodMatch').length > 0){
	productList = '/Services/ProductService.asmx/ProductList?v=1.0&lId=0&so=' + so + '&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&locId=' + locId + '&customerId=0&mId=&p=1&rp=50&imgSizeId=0&fn1=CustomFields&fk1=3&fv1=true';
	targetelement = $(".goodMatchProducts").attr("id");

	productList += '&serial=' + serial;

	jsonProductList = new JsonProductList(targetelement, productList, true);
	function ChangeCurrentLanguage(oSelect){
		window.location.href=window.location.pathname + '?' + pageQuery.toString();
	}
}

function createAddedToBasketProducts() {
	if($('.ucInfoMessageContent').length > 0){
		addedToBasketGoodOffers = '/Services/ProductService.asmx/ProductList?v=1.0&lId=0&so=' + so + '&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&locId=' + locId + '&customerId=0&mId=&p=1&rp=72&imgSizeId=0&fn1=CustomFields&fk1=3&fv1=true';

		addedToBasketGoodOffers += '&serial=' + serial;

		$.getJSON(addedToBasketGoodOffers, function(jsondata) {

			var productCount=0;
            $.each(jsondata.data.items, function(key, val) {

				//Make sure to get the correct stock message
				var deliveryData = "nothing";
				var hasExpectedDelivery = 'false';

				if(val.inventoryCountFormatted >= 1) {
					deliveryData = val.inStockMessage;
					hasExpectedDelivery = 'false';
				}
				if(val.inventoryCountFormatted <= 0) {
					if(val.hasExpectedDeliveryDate == true) {
						deliveryData = val.expectedDeliveryDateFormatted;
						hasExpectedDelivery = 'true';
					}
					else {
						deliveryData = val.notInStockMessage ;
						hasExpectedDelivery = 'false';
					}
				}

				//Get the main image url from the product, and if no image is found load the no image replacement
				var imgsrc = "";
				if(val.images[0]){
					imgsrc = val.images[0].url.replace(/sizeId=([0-9]+)/,"sizeId=3340");
				}
				else
				{
					imgsrc = "/SL/SI/695/7e8d0f1e-58b2-4bcb-a41d-d124a29c18fc.jpg";
				}

				//Create the add to basket button
				var addToBasketData = "";
				var addToBasketTxt = "Tilføj til kurv";

				basketQtyInput = $('<input></input>')
				basketQtyInput.attr('value', '1');
				basketQtyInput.attr('type', 'tel');
				basketQtyInput.addClass('basketQtyInput');

				if(val.showAddToBasket = "true") {
					if(val.isBuyable = "true") {
						basketDiv = $("<div></div>");
						basketDiv.click(function(){

							var getQtyAmount = $(this).parent().children('input.basketQtyInput').val();

							if(val.grossWeightFormatted >= weightBeforeZipCode) {
								ActivateBasketButtonPrompt(val.eSellerId,0,'',getQtyAmount,'GET',encodeURIComponent(window.location.pathname + window.location.search),false,true,val.expectedDeliveryDateFormatted);
							}
							else {
								atbNoQty(val.eSellerId, 0, getQtyAmount, '', '', '', '', encodeURIComponent(window.location.pathname + window.location.search));
							}
						});
						basketDiv.addClass("addToBasketLnk");
						basketDiv.text(addToBasketTxt);
					}
				}

				if($('#frontPageProductsBdy.jsonProducts').length > 0){
					productDiv = $("<div></div>");
				}
				else {
					productDiv = $("<li></li>");
				}
				productDiv.addClass("productElement");
				productInnerDiv = $('<div></div>');
				productInnerDiv.addClass('productInnerDiv');
				productImageDiv = $("<div></div>");
				productImageDiv.addClass("productImage");
				productLink = $("<a></a>");
				productLink.attr("href",val.URLPathAndQuery);
				productImg = $("<img></img>");
				productImg.attr("src", imgsrc);
				productImg.attr("alt", val.name);
				productLink.append(productImg);
				productImageDiv.append(productLink);
				productInnerDiv.append(productImageDiv);

                productnameDiv = $("<div></div>");
                productnameDiv.addClass("productName");
                productNameLnk = $("<a></a>");
                productNameLnk.attr("href",val.URLPathAndQuery);
				productName = val.name;
				productName = productName.substring(0,16);
				productName = productName + "...";
                productNameLnk.text(productName);
                productnameDiv.append(productNameLnk);
                productInnerDiv.append(productnameDiv);

                productPriceDiv = $('<a></a>');
                productPriceDiv.attr('href', val.URLPathAndQuery);
                productPriceDiv.addClass('productPriceDiv');
                if(val.hasSalesPrice.length != 0) {
                    if(!val.hasSalesPrice == false) {
                        productPriceDiv.append(val.salesPrices[0].tagPriceFormatted);
                    }
                }
                productInnerDiv.append(productPriceDiv);

				productPrevPriceDiv = $('<a></a>');
                productPrevPriceDiv.attr('href', val.URLPathAndQuery);
                productPrevPriceDiv.addClass('productPrevPriceDiv');
                if(val.hasSalesPrice.length != 0) {
                    if(val.hasSalesPrice == true) {
                        if(!val.salesPrices[0].hasPreviousPrice == false) {
                            productPrevPriceDiv.append(val.salesPrices[0].previousTagPriceFormatted);
                        }
                    }
                }
                productInnerDiv.append(productPrevPriceDiv);

                //productInnerDiv.append(basketQtyInput);
                //productInnerDiv.append(basketDiv);

                if(val.greatBuy != false) {
                    goodDeal = $('<a></a>');
                    goodDeal.attr('href', val.URLPathAndQuery);
                    goodDeal.addClass('goodDeal');
                    goodDeal.append($('.hiddenText .goodDealText').text());
                    productInnerDiv.append(goodDeal);
                }

                if(val.noveltyProduct != false) {
                    noveltyProduct = $('<a></a>');
                    noveltyProduct.attr('href', val.URLPathAndQuery);
                    noveltyProduct.addClass('noveltyProduct');
                    noveltyProduct.append($('.hiddenText .noveltyProductText').text());
                    productInnerDiv.append(noveltyProduct);
                }

                productDiv.append(productInnerDiv);
                $('#ucInfoMessageContentProducts').append(productDiv);

			});

			if($('#ucInfoMessageContentProducts').length > 0){
				var screen = $(window).width();
				if(screen <= 640) {
					$('#ucInfoMessageContentProducts').slick({
						infinite: false,
						arrows: true,
						slidesToShow: 2,
						slidesToScroll: 2,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				}
				else if(screen <= 1025 && screen > 640) {
					$('#ucInfoMessageContentProducts').slick({
						infinite: false,
						arrows: true,
						slidesToShow: 3,
						slidesToScroll: 3,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				}
				else if(screen > 1025) {
					$('#ucInfoMessageContentProducts').slick({
						infinite: false,
						arrows: true,
						slidesToShow: 5,
						slidesToScroll: 5,
						autoplay: false,
						autoplaySpeed: 2000,
					});
				};
            }

		});

	}
}

/**
 * TinySort is a small script that sorts HTML elements. It sorts by text- or attribute value, or by that of one of it's children.
 * @summary A nodeElement sorting script.
 * @version 2.2.2
 * @license MIT/GPL
 * @author Ron Valstar <ron@ronvalstar.nl>
 * @copyright Ron Valstar <ron@ronvalstar.nl>
 * @namespace tinysort
 */
!function(a,b){"use strict";function c(){return b}"function"==typeof define&&define.amd?define("tinysort",c):a.tinysort=b}(this,function(){"use strict";function a(a,d){function h(){0===arguments.length?q({}):b(arguments,function(a){q(z(a)?{selector:a}:a)}),n=G.length}function q(a){var b=!!a.selector,d=b&&":"===a.selector[0],e=c(a||{},p);G.push(c({hasSelector:b,hasAttr:!(e.attr===g||""===e.attr),hasData:e.data!==g,hasFilter:d,sortReturnNumber:"asc"===e.order?1:-1},e))}function r(){b(a,function(a,b){B?B!==a.parentNode&&(H=!1):B=a.parentNode;var c=G[0],d=c.hasFilter,e=c.selector,f=!e||d&&a.matchesSelector(e)||e&&a.querySelector(e),g=f?E:F,h={elm:a,pos:b,posn:g.length};D.push(h),g.push(h)}),A=E.slice(0)}function s(){E.sort(t)}function t(a,c){var d=0;for(0!==o&&(o=0);0===d&&n>o;){var g=G[o],h=g.ignoreDashes?l:k;if(b(m,function(a){var b=a.prepare;b&&b(g)}),g.sortFunction)d=g.sortFunction(a,c);else if("rand"==g.order)d=Math.random()<.5?1:-1;else{var i=f,p=y(a,g),q=y(c,g),r=""===p||p===e,s=""===q||q===e;if(p===q)d=0;else if(g.emptyEnd&&(r||s))d=r&&s?0:r?1:-1;else{if(!g.forceStrings){var t=z(p)?p&&p.match(h):f,u=z(q)?q&&q.match(h):f;if(t&&u){var v=p.substr(0,p.length-t[0].length),w=q.substr(0,q.length-u[0].length);v==w&&(i=!f,p=j(t[0]),q=j(u[0]))}}d=p===e||q===e?0:q>p?-1:p>q?1:0}}b(m,function(a){var b=a.sort;b&&(d=b(g,i,p,q,d))}),d*=g.sortReturnNumber,0===d&&o++}return 0===d&&(d=a.pos>c.pos?1:-1),d}function u(){var a=E.length===D.length;if(H&&a)I?E.forEach(function(a,b){a.elm.style.order=b}):B.appendChild(v());else{var b=G[0],c=b.place,d="org"===c,e="start"===c,f="end"===c,g="first"===c,h="last"===c;if(d)E.forEach(w),E.forEach(function(a,b){x(A[b],a.elm)});else if(e||f){var i=A[e?0:A.length-1],j=i.elm.parentNode,k=e?j.firstChild:j.lastChild;k!==i.elm&&(i={elm:k}),w(i),f&&j.appendChild(i.ghost),x(i,v())}else if(g||h){var l=A[g?0:A.length-1];x(w(l),v())}}}function v(){return E.forEach(function(a){C.appendChild(a.elm)}),C}function w(a){var b=a.elm,c=i.createElement("div");return a.ghost=c,b.parentNode.insertBefore(c,b),a}function x(a,b){var c=a.ghost,d=c.parentNode;d.insertBefore(b,c),d.removeChild(c),delete a.ghost}function y(a,b){var c,d=a.elm;return b.selector&&(b.hasFilter?d.matchesSelector(b.selector)||(d=g):d=d.querySelector(b.selector)),b.hasAttr?c=d.getAttribute(b.attr):b.useVal?c=d.value||d.getAttribute("value"):b.hasData?c=d.getAttribute("data-"+b.data):d&&(c=d.textContent),z(c)&&(b.cases||(c=c.toLowerCase()),c=c.replace(/\s+/g," ")),c}function z(a){return"string"==typeof a}z(a)&&(a=i.querySelectorAll(a)),0===a.length&&console.warn("No elements to sort");var A,B,C=i.createDocumentFragment(),D=[],E=[],F=[],G=[],H=!0,I=a.length&&(d===e||d.useFlex!==!1)&&-1!==getComputedStyle(a[0].parentNode,null).display.indexOf("flex");return h.apply(g,Array.prototype.slice.call(arguments,1)),r(),s(),u(),E.map(function(a){return a.elm})}function b(a,b){for(var c,d=a.length,e=d;e--;)c=d-e-1,b(a[c],c)}function c(a,b,c){for(var d in b)(c||a[d]===e)&&(a[d]=b[d]);return a}function d(a,b,c){m.push({prepare:a,sort:b,sortBy:c})}var e,f=!1,g=null,h=window,i=h.document,j=parseFloat,k=/(-?\d+\.?\d*)\s*$/g,l=/(\d+\.?\d*)\s*$/g,m=[],n=0,o=0,p={selector:g,order:"asc",attr:g,data:g,useVal:f,place:"org",returns:f,cases:f,forceStrings:f,ignoreDashes:f,sortFunction:g,useFlex:f,emptyEnd:f};return h.Element&&function(a){a.matchesSelector=a.matchesSelector||a.mozMatchesSelector||a.msMatchesSelector||a.oMatchesSelector||a.webkitMatchesSelector||function(a){for(var b=this,c=(b.parentNode||b.document).querySelectorAll(a),d=-1;c[++d]&&c[d]!=b;);return!!c[d]}}(Element.prototype),c(d,{loop:b}),c(a,{plugin:d,defaults:p})}());
