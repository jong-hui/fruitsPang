
class Event {

	constructor (GameObject) {
		this.hook();
	}

	hook () {

		on("click", "#btn-start", function() {
			CurGame.GameStart();
		});

	}

}