function openNav(){document.getElementById("mySidenav").style.width="250px"}function closeNav(){document.getElementById("mySidenav").style.width="0"}function popup(e){var n=(screen.width-700)/2,t="width=700, height=400";return t+=", top="+(screen.height-400)/2+", left="+n,t+=", directories=no",t+=", location=no",t+=", menubar=no",t+=", resizable=no",t+=", scrollbars=no",t+=", status=no",t+=", toolbar=no",newwin=window.open(e,"windowname5",t),window.focus&&newwin.focus(),!1}
$('#logout_btn').click(function(){$.ajax({type: 'POST',data: JSON.stringify({}),contentType: 'application/json',url: '/logout',success: function(data) {if (data.error == false);toastr['success']("Logout Success");setTimeout(function(){window.location.href = '/';}, 300);} }); })
function getCookie(name) {var cookieArr = document.cookie.split(";");for(var i = 0; i < cookieArr.length; i++) {var cookiePair = cookieArr[i].split("="); if(name == cookiePair[0].trim()) {return decodeURIComponent(cookiePair[1]);} }
    return null;
}
var dlike_user_img = 'https://i.postimg.cc/rwbTkssy/dlike-user-profile.png';
$("#user_img, #p_img, .my_img").attr("src", dlike_user_img).show();
var Username = getCookie("dlike_username");
if(Username) {console.log(Username);var dlike_username  = Username; 
    $("#logout_btn").show();$(".icon_profile").hide();$(".img_profile").show()
    breej.getAccount(dlike_username, (err, account) => {
        if(account && account.json.profile.cover_image){var prof_cov_img=account.json.profile.cover_image;}else{ var prof_cov_img=""}
        if(account && account.json.profile.avatar){var dlike_user_img=account.json.profile.avatar;}else{var dlike_user_img="https://i.postimg.cc/rwbTkssy/dlike-user-profile.png"}
        if(account && account.json.profile.location){var user_location=account.json.profile.location;}else{var user_location=""}
        if(account && account.json.profile.website){var user_website=account.json.profile.website;}else{var user_website=""}
        if(account && account.json.profile.about){var user_about=account.json.profile.about;}else{var user_about=""}
        $('#profile_img').val(dlike_user_img);$('#cover_img').val(prof_cov_img);$('#profile_location').val(user_location);$('#profile_website').val(user_website);$('#profile_about').val(user_about);
    })
} else {console.log('not a valid user')}


$('.signin_btn').click(function() {signinNOw();})
$('.loginNow_btn').click(function() {loginNOw();});
$('.register_btn').click(function() {registerNow();});

function accountKeys() {var signup_block  = document.querySelector('.signup_section');var key_section = document.querySelector('.key_section');
    jQuery(signup_block).animate({opacity: 0,top : -20}, 300, function () {signup_block.style.display = 'none';key_section.style.opacity = 0;key_section.style.display = ''; jQuery(key_section).animate({opacity: 1,top: 0}, 300);});
}

$('.copy_pass').click(function() {var copyText = document.getElementById("acct_priv_key");copyText.select();copyText.setSelectionRange(0, 99999); /* For mobile devices */
    document.execCommand("copy");$('.copy_pass').html('Copied!');toastr['success']("Key copied to clipboard.");return false;
})

function registerNow() {var main_login_block  = document.querySelector('.login_section');var signup_block = document.querySelector('.signup_section');
    jQuery(main_login_block).animate({opacity: 0,top    : -20}, 300, function () {main_login_block.style.display = 'none';signup_block.style.opacity = 0;signup_block.style.display = '';jQuery(signup_block).animate({opacity: 1,top    : 0}, 300);});
}

function loginNOw() {var main_login_block  = document.querySelector('.login_section');var signup_block = document.querySelector('.signup_section');
    jQuery(signup_block).animate({opacity: 0,top    : -20}, 300, function () {signup_block.style.display = 'none';main_login_block.style.opacity = 0;main_login_block.style.display = ''; jQuery(main_login_block).animate({opacity: 1,top    : 0}, 300); });
}

function signinNOw() {var keys_block  = document.querySelector('.key_section');var login_block = document.querySelector('.login_section');
    jQuery(keys_block).animate({opacity: 0,top    : -20}, 300, function () {keys_block.style.display = 'none';login_block.style.opacity = 0;login_block.style.display = '';jQuery(login_block).animate({opacity: 1,top    : 0}, 300);});
}

$('.login_btn').click(function() {
    $(".login_btn").attr("disabled", true);$('#login_txt').hide();$('.login_loader').show();
    let login_user = $('#login_user_id').val();let login_pass = $('#login_pass').val();
    if (login_user=="") {toastr.error('phew.. Username should not be empty');$(".login_btn").attr("disabled", false);return false;}
    if (login_pass=="") {toastr.error('phew... Private key should not be empty');$(".login_btn").attr("disabled", false);return false;}
    breej.getAccount(login_user, function(error, account) {const pivkey = login_pass;
        if (!account || account.length === 0) {
            toastr.error('phew.. Username does not exist');$(".login_btn").attr("disabled", false);$('#login_txt').show();$('.login_loader').hide();
            return
        }
        if (breej.privToPub(pivkey) !== account.pub) {
            toastr.error('phew.. Private key does not match for account @'+login_user);$(".login_btn").attr("disabled", false);$('#login_txt').show();$('.login_loader').hide();
            return
        }
        $.ajax({type: 'POST',data: JSON.stringify({ pivkey: pivkey,  username: login_user}),contentType: 'application/json',url: '/loginuser',            
            success: function(data) {
                if (data.error == true) {toastr['error']("Login Fail");$(".login_btn").attr("disabled", false);$('#login_txt').show();$('.login_loader').hide();return false;
                } else {toastr['success']("Login Success");setTimeout(function(){window.location.href = '/';}, 300);}
            }
        });
    })

});

$('.signup_btn').click(function() {let input_username = $('#user_name').val();if (input_username=="") {toastr.error('phew.. Username should not be empty');return false;}; $('.signup_txt').html('Creating...'); $('.signup_btn').attr("disabled", true); 
    breej.getAccounts([input_username], function(error, accounts) {
        if (!accounts || accounts.length === 0) {var key=breej.keypair(); var pub=key.pub;var priv=key.priv;
            $.ajax({type: 'POST',data: JSON.stringify({name: input_username,pub: pub,ref: 'dlike'}),contentType: 'application/json',url: '/signup',            
                success: function(data) {console.log(data)
                    if (data.error == true) {toastr['error'](data.message);$('.signup_btn').attr("disabled", false);return false;
                    } else {toastr['success']("Account cteared Successfully!");accountKeys();$('#acct_priv_key').val(priv);}
                }
            });
        } else {toastr.error('phew.. Username already exist');$('.signup_txt').html('Signup'); $('.signup_btn').attr("disabled", false); return false;}
    })
});   



$('.btn_app_wit').click(function() {
    if (dlike_username != null) {var nodeName = $(this).attr("data-node");$(this).closest("tr").find(".btn_txt_app").hide();$(this).closest("tr").find(".wit_loader").show();
        $.ajax({url: '/witup',type: 'POST',data: JSON.stringify({ nodeName: nodeName }),contentType: 'application/json', success: function(data)  {if (data.error == false) {toastr['success']("Approved Successfully!");setTimeout(function(){window.location.reload();}, 300);} else {toastr['error'](data.message);$(this).closest("tr").find(".btn_txt_app").show();$(this).closest("tr").find(".wit_loader").hide();return false}} });
    } else { toastr.error('hmm... You must be login!'); return false; }
});

$('.btn_unapp_wit').click(function() {
    if (dlike_username) {var nodeName = $(this).attr("data-node");$(this).closest("tr").find(".btn_txt_unapp").hide();$(this).closest("tr").find(".unwit_loader").show();
        $.ajax({url: '/witunup',type: 'POST',data: JSON.stringify({ nodeName: nodeName }),contentType: 'application/json',success: function(data)  {if (data.error == false) {toastr['success']("UnApproved Successfully!");setTimeout(function(){window.location.reload();}, 300); } else {toastr['error'](data.message);$(this).closest("tr").find(".btn_txt_unapp").show();$(this).closest("tr").find(".unwit_loader").hide();return false} } });
    } else { toastr.error('hmm... You must be login!'); return false; }
});

$('.btn_follow_user').click(function() {
    if (dlike_username) {var followName = $(this).attr("data-username");$(".btn_txt_follow").html('Following...'); $('.btn_follow_user').attr("disabled", true);
        $.ajax({url: '/follow',type: 'POST',data: JSON.stringify({ followName: followName }),contentType: 'application/json',success: function(data)  {if (data.error == false) {toastr['success']("Followed Successfully!");setTimeout(function(){window.location.reload();}, 300); } else {toastr['error'](data.message);$(".btn_txt_follow").html('Follow');$('.btn_follow_user').attr("disabled", false);return false} } });
    } else { toastr.error('hmm... You must be login!'); return false; }
});

$('.btn_unfollow_user').click(function() {
    if (dlike_username) {var unfollowName = $(this).attr("data-username");$(".btn_txt_unfollow").html('UNFollowing...'); $('.btn_unfollow_user').attr("disabled", true);
        $.ajax({url: '/unfollow',type: 'POST',data: JSON.stringify({ unfollowName: unfollowName }),contentType: 'application/json',success: function(data)  {if (data.error == false) {toastr['success']("UNFollowed Successfully!");setTimeout(function(){window.location.reload();}, 300); } else {toastr['error'](data.message);$(".btn_txt_unfollow").html('Following');$('.btn_unfollow_user').attr("disabled", false);return false} } });
    } else { toastr.error('hmm... You must be login!'); return false; }
});

$('.share_me').click(function() {
    if (dlike_username) {$('#share_plus').hide();$('.share_loader').show();
        let input_url = $("#url_field").val();
        if (input_url == ''){ $("#url_field").css("border-color", "RED");toastr.error('phew... You forgot to enter URL');$('#share_plus').show();$('.share_loader').hide();return false;}
        let verifyUrl = getDomain(input_url);
        var sites = ["dlike.io", "wikipedia.org","facebook.com","youtube.com", "pinterest.com","twitter.com","bloomberg.com","youtu.be","pornhub.com","imgur.com","amazon.com","imgbb.com","freepik.com"];
        if(sites.includes(verifyUrl)){toastr.error('Sharing from this URL is not allowed');return false;}
        if (isValidURL(input_url)) {
            $.ajax({url: '/share',type: 'POST',data: JSON.stringify({ url: input_url }),contentType: 'application/json',
                success: function(data)  {
                    let title=data.title;let image=data.image;let description=data.description;let url="input_url";
                    if(title !=''){
                        $('.share_link').hide();$('.edit_psot').show();
                        $('.data-title').html(title);$(".link_image").attr("src", image);$('#domain_name').html(verifyUrl);$('#post_desc').html(description);$('.url_link').val(input_url)}
                    else{toastr.error('Unable to share link'); return false; }
                }
            });
        } else {toastr.error('phew... URL is not Valid');}
    } else { toastr.error('hmm... You must be login!'); return false; }
});


$('.dlike_share_post').click(function(clickEvent) {
    if (dlike_username) {
        let urlInput = $('.url_link').val();
        if($('.dlike_cat').val() == "0") {$('.dlike_cat').css("border-color", "RED");toastr.error('Please Select an appropriate Category');return false;}
        var inputtags = $.trim($('.dlike_tags').val()).toLowerCase();let tags=inputtags.replace(/\s\s+/g, ' ');let newtags = $.trim(tags).split(' ');
        if (newtags.length < 2) {$('.tags').css("border-color", "RED");toastr.error('Please add at least two related tags');return false;}
        if (newtags.length > 5) {$('.tags').css("border-color", "RED");toastr.error('maximum 5 tags allowed');return false;}
        var allowed_tags_type = /^[a-z\d\s]+$/i;
        if (!allowed_tags_type.test(tags)) {$('.tags').css("border-color", "RED");toastr.error('Only alphanumeric tags, no Characters.');return false;}
        var post_tags = tags.split(' ');
        var description = $('textarea#post_desc').val();
        var post_description = $.trim(description).split(' ');console.log(post_description.length)
        if (post_description.length < 10) {$('.data-desc').css("border-color", "RED");toastr.error('Please add description of minimum 30 words');return false;}
        if (post_description.length > 82) {$('.data-desc').css("border-color", "RED");toastr.error('Please add description not more than 80 words');return false;}
        var title = $('.data-title').html();
        if (title=="") {toastr.error('Some error in this link!');return false;}
        var post_body = description.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
        var urlImage =  $('.post_img img').attr('src');
        var category = $( ".dlike_cat option:selected" ).text(); var post_category=category.toLowerCase();
        $(".dlike_share_post").attr("disabled", true);$('.dlike_share_post').html('Publishing...');
        $.ajax({type: "POST",url: "/post",data: {title: title,tags:post_tags,description:post_body,category: post_category,image:urlImage,exturl:urlInput},
            success: function(data) {console.log(data)
                if (data.error == false) {toastr['success']("Link Shared Successfully!");setTimeout(function(){window.location.href = '/';}, 400);
                } else {toastr['error'](data.message);$(".dlike_share_post").attr("disabled", false);$('.dlike_share_post').html('Publish');return false}
            },
        });
    } else { toastr.error('hmm... You must be login!'); return false; }
})

function isValidURL(url) {var RegExp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (RegExp.test(url)) {return true;} else {toastr.error('phew... Enter a valid url');return false;}
}
function getDomain(url) {let hostName = getHostName(url);let domain = hostName;
    if (hostName != null) {
        let parts = hostName.split('.').reverse();
        if (parts != null && parts.length > 1) {
            domain = parts[1] + '.' + parts[0];
            if (hostName.toLowerCase().indexOf('.co.uk') != -1 && parts.length > 2) { domain = parts[2] + '.' + domain;}
        }
    }
    return domain;
}
function getHostName(url) {var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2];
    } else {return false;}
}

$('.latest-post-section').on("click", ".hov_vote", function() {
    if (dlike_username) {var postLink = $(this).attr("data-permlink");var postAuthor = $(this).attr("data-author");
        $(this).addClass('fas fa-spinner fa-spin like_loader');
        console.log(postLink);console.log(postAuthor)
        $.ajax({ type: "POST",url: "/upvote", data: {author: postAuthor, postLink: postLink},
            success: function(data) {
                if (data.error == false) {$('.hov_vote').removeClass('fas fa-spinner fa-spin like_loader');toastr['success']("Upvoted Successfully!");setTimeout(function(){window.location.href = '/';}, 400);
                } else {$('.hov_vote').removeClass('fas fa-spinner fa-spin like_loader');toastr['error'](data.message);return false}
            }
        });
    } else { toastr.error('hmm... You must be login!'); return false; }
}); 



    /*-------------------------------------
    Navigation Settings
    -------------------------------------*/
    function navControl(){
        if($(window).width() < 992){
            $(document).on('click', function (event) {
                var clickover = $(event.target);
                var _opened = $("#navbarSupportedContent").hasClass("show");
                if (_opened === true && !(clickover.is('.dropdown, .dropdown *'))) {
                    $("button.navbar-toggler").trigger('click');
                }
            });
            $('#navbarSupportedContent .dropdown>a').unbind('click');
            $('#navbarSupportedContent .dropdown>a').on('click', function (e) {
                e.preventDefault();
                $(this).toggleClass('sm-shown').siblings('.dropdown-menu').slideToggle();
            });

            $('#navbarSupportedContent .dropdown a *').on('click', function (e) {
                e.stopPropagation();
            });
        } else {
            $('#navbarSupportedContent .dropdown-menu').css('display', 'block');
        }
    }
    navControl();
    $(window).on('resize orientationchange', function(){
        navControl();
    });
    /*--------------------------------------------
            Toggle Settings
    ---------------------------------------------*/
    $(".favorite-coin").on('click', function () {
        $(this).toggleClass("active");
    });
