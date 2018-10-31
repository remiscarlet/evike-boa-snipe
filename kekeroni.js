var ENABLED = false;

var CC_NAME = "Joe Shmoe"
var CC_NUM = "4111111111111111"
var CC_EXP = "12/34"
var CC_CVV = "666"

/*==================================*/
if (ENABLED) { run(); }
function run() {
    var curr_url  = window.location.href;
    console.log(curr_url)
    
    ensureLoggedIn(curr_url);
    
    if (curr_url === "https://www.evike.com/epic-deals/") {
        openBoALinkIfAvailable();
        
        setTimeout(function() {
            location.reload();
        }, 5000);
    } else if (curr_url === "https://www.evike.com/account.php") {
        // Account page. We get here if we just logged in. Redirect to epic deals page.
        setUrl("https://www.evike.com/epic-deals/");
    } else if (curr_url === "https://www.evike.com/shopping_cart.php") {
        ensureOnlyOneItemInCart();

        setUrl("https://www.evike.com/checkout_shipping.php");
    } else if (curr_url === "https://www.evike.com/ec_shipping.php") {
        // Select Ground Shipping
        $('input[value="ups_GND"]').click();

        // Click "Next"
        $('form[name="checkout_address"]').children('button.blue').click();
    } else if (curr_url === "https://www.evike.com/checkout_payment.php") {
        enterCCInfo();

        // Enter free 3 day
        $('input[name="coupon"]').val("freeship");

        // Review order page
        $('form[name="checkout_payment"]').children('button.blue').click();
    } else if (curr_url === "https://www.evike.com/checkout_confirmation.php") {
        if (isBoaInCart) {
            // PLACE ORDER
            $('button[name="placeorderbuttont"]').click();
        }
    } else {
        // BoA buy page
        $('.addtocart').click();
    }
}

function isBoAInCart() {
    var text = $('#disclaimerbox ~ div.linebox').text();
    return text.toLowerCase().indexOf('box of awesomeness') !== -1;
}

function enterCCInfo() {
    var exp_month = CC_EXP.split("/")[0];
    var exp_year = CC_EXP.split("/")[1];

    $('input[name="authorizenet_aim_cc_owner"]').val(CC_NAME);
    $('input[name="authorizenet_aim_cc_number"]').val(CC_NUM);
    $('input[name="authorizenet_aim_cc_expires_month"]').val(exp_month);
    $('input[name="authorizenet_aim_cc_expires_year"]').val(exp_year);
    $('input[name="authorizenet_aim_cc_cvv"]').val(CC_CVV);
}

/** 
 * Doesn't technically ensure "only one item" but sets off the chain of events to get back to cart page with just BoA
 * 
 * If more than one item, clear cart.
 * Once cleared, go back to epic deals page.
 * Once there, rest of logic will handle adding the BoA item into cart if it's available.
 */
function ensureOnlyOneItemInCart() {
    var cart_len = $('.cartlistproduct').length;

    if (cart_len > 1) {
        // Going to link clears cart.
        setUrl('/shopping_cart.php?action=clear_cart');
    } else if (cart_len === 0) {
        // Nothing in cart. back to epic deals page.
        setUrl("https://www.evike.com/epic-deals/");
    }
}

function openBoALinkIfAvailable() {
    $('.dealcontainer').find('.dealitem').each(function() {
        var url = $(this).children('a').attr('href');
        var text = $(this).text();
        if ((text.indexOf("THE BOX OF AWESOMENESS - \"Flash Edition\"") !== -1) &&
            (text.indexOf("ADD TO CART") !== -1)){
                setUrl(url);
        }
    });
}

function ensureLoggedIn(curr_url) {
    var acct_container_text = $('.account-container').text();
    if (acct_container_text.indexOf("Sign In") !== -1) {
        setUrl('https://www.evike.com/login.php');
    }
    
    if (curr_url === "https://www.evike.com/login.php") {
        setTimeout(function() {
            $('form[name="login"]').children('button').click();
        }, 5000);
    }
}

function setUrl(url) {
    console.log("Redirecting to: "+url);
    window.location.href = url;
}
