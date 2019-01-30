

class GameBoard {

	constructor (Game) {

		this.Game = Game;
		this.removeTemp = [];

	}

	stageAnimation (stage) {
		return new Promise((resolve, reject) => {
			$("#overrap").addClass('animation');
			this.setData();


			Promise.all([
				this.pangChk(),
				wait(4000)
			]).then((values) => {
				this.stageAnimationEnd();

				Promise.seque([
					this.viewData,
					this.removeData
				]).then(() => {
					resolve(1);
				})
				
				// [, ].reduce((stacks, promise) => {
				// 	return stacks.then(promise.bind(this));
				// }, Promise.resolve()).then(() => {
				// });

				// this.viewFruit().then(() => {
				// 	this.removeFruit().then(() => {
				// 		resolve(1);
				// 	});
				// });

				// Promise.all([
				// 	this.viewFruit(),
				// 	this.removeFruit()
				// ]).then(() => {
				// 	resolve(1);
				// });

			});

		});
	}

	stageAnimationEnd () {
		$("#overrap").removeClass('animation');

	}

	setData () {

		for (var i = 0; i < 8; i++) {
			this.Game.data[i] = [];
			for (var j = 0; j < 8; j++) {
				this.Game.data[i][j] = new Fruit(i, j);
			}
		}
	}

	viewData () {
		return new Promise((resolve, reject) => {
			dd("viewData Start");
			multi(this.Game.data, function(a, b) {
				b.refreshPos();
			});

			setTimeout(() => { dd("viewData End"); resolve('done') }, 500);
		});
	}

	removeData () {
		return new Promise((resolve, reject) => {
			dd("removeData Start");

			$.each(this.removeTemp, (a, b) => {
				b.destroy();

				if (a == this.removeTemp.length-1) {
					dd("removeData End")
					resolve("end");
				}
			});
		});
	}

	// 보드가 전부 꽉 차 있을때만 정상작동한다.
	pangChk () {
		return new Promise((resolve, reject) => {
			let baseData = this.Game.data;
			let result = [];

			function findPang (i, val, arr = [], step = 0, arrow = "") {
				arr.push(val);

				let isNext = 0;
				let tester = {
					bottom : baseData[val.x][val.y+1],
					top : baseData[val.x][val.y-1],
					left : baseData[val.x-1] == undefined ? undefined : baseData[val.x-1][val.y],
					right : baseData[val.x+1] == undefined ? undefined : baseData[val.x+1][val.y]
				}

				if (arrow == "") {
					$.each(tester, function(a, b) {
						if (b != undefined && b.fruitId == val.fruitId) {
							findPang(i, b, arr.slice(), step+1, a);
							isNext = 1;
						}
					});
				} else {
					if (tester[arrow] != undefined && tester[arrow].fruitId == val.fruitId) {
						findPang(i, tester[arrow], arr.slice(), step+1, arrow);
						isNext = 1;
					}
				}

				if (!isNext && arr.length >= 3) {
					$.each(arr, function(a, b) {
						if (result.find(x => x.id == b.id)) {
							return true;
						}

						result.push(b);
					});
				}
			}

			multi(baseData, findPang);

			(() => {
				this.removeTemp = result;
				resolve(result);
			})();
		});
	}
}