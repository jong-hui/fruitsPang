

class BoardItem {

	constructor (element, x,y ) {
		this.element = $(element).appendTo("#game-board-items");
		this.x = x;
		this.y = y;

		this.element.css({
			left : Config.fruitsLeft[this.x],
			top : -(Config.fruitsTop[this.y] + 80)
		});

		return this;
	}


	refreshPos () {
		this.element.css({
			left : Config.fruitsLeft[this.x],
			top : Config.fruitsTop[this.y]
		});
	}

	destroy () {
		this.element.addClass('remove');

		$.each(CurGame.data[this.x], (a, b) => {
			dd(this.x, this.y, a, b);
			if (b != undefined && b.y < this.y) {
				b.y += 1;
			}
		});

		setTimeout(() => {
			this.element.removeClass('remove').remove();
			// delete CurGame.data[this.x][this.y];
		}, 500);
		
		CurGame.score += 100;

		this.remove = 1;
	}


}