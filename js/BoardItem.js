

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

	removeChk () {
		this.remove = 1;

		dd("im die :(", this.element);
	}

	destroy () {
		this.element.addClass('remove');

		setTimeout(() => {
			this.element.removeClass('remove').remove();

			delete CurGame.data[this.x][this.y];
		}, 500);
	}


}