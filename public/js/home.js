/* eslint: false;*/
$(function(){
	$('.category-hot ul li').click(function(e) {
		var active = $('.category-hot ul li.active');
		var ID = e.target.href.split('#')[1];
		var that = $(this)
		var boo = $(this).attr('class') ? true : false;
		if(!boo){
			active.removeClass('active')
			that.attr('class','active')
			$('.'+ID).css('opacity','1')
			$('.'+ID).css('margin-left','0')
			$('.'+ID)[0].style.display = 'block'
			// console.log($(active).find('a')[0].style.display = 'block'
			$('.'+$(active).find('a').attr('href').split('#')[1]).css('opacity',1)
			$('.'+$(active).find('a').attr('href').split('#')[1]).css('margin-left','-100px')
			$('.'+$(active).find('a').attr('href').split('#')[1])[0].style.display = 'none'
		}		
	});
  $('.book-books > ul li').click(function(e) {
    var active = $('.book-books > ul li.active');
    var ID = e.target.href.split('#')[1];
    console.log('ID',ID);
    var that = $(this);
    var boo = $(this).attr('class') ? true : false;
		if(!boo){
      active.removeClass('active');
			that.attr('class','active');
			$('.'+ID).css('opacity','1')
			$('.'+ID).css('margin-left','0')
			$('.'+ID)[0].style.display = 'block'
			// console.log($(active).find('a')[0].style.display = 'block'
			$('.'+$(active).find('a').attr('href').split('#')[1]).css('opacity', 1);
			$('.'+$(active).find('a').attr('href').split('#')[1]).css('margin-left','-100px');
			$('.'+$(active).find('a').attr('href').split('#')[1])[0].style.display = 'none';
		}
  });
});