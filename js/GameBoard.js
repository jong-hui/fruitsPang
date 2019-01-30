

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

				
				[this.viewData, this.removeData].reduce((stacks, promise) => {
					return stacks.then(promise.bind(this));
				}, Promise.resolve()).then(() => {

					this.inLoop().then(() => {
						resolve(1);
					});

				});

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

	inLoop () {
		return new Promise((resolve, reject) => {
			// reduce 로 대체하기

			this.viewData().then(() => {

				this.reDefineData().then(() => {

					this.viewData();

					this.pangChk().then(() => {
						if (this.removeTemp.length) {
							setTimeout(() => {
								this.removeData().then(() => {
									this.inLoop();
								});
							}, 500);
						}
					});
				});
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

	reDefineData () {
		return new Promise((resolve, reject) => {
			let reDefineData = [];

			for (var i = 0; i < 8; i++) {
				reDefineData[i] = [];

				for (var j = 0; j < 8; j++) {
					let isData = this.Game.data[i].find(x => x.y == j);

					reDefineData[i][j] = (isData == undefined || isData.remove) ? new Fruit(i, j) : isData;
				}
			}

			this.Game.data = reDefineData;

			setTimeout(() => {
				resolve(this.Game.data);
			}, 100);
		});
	}

	viewData () {
		return new Promise((resolve, reject) => {
			dd("viewData Start");
			multi(this.Game.data, function(a, b) {
				if (b == undefined) {
					return true;
				}

				b.refreshPos();
			});

			setTimeout(() => { dd("viewData End"); resolve('done') }, 500);
		});
	}

	removeData () {
		return new Promise((resolve, reject) => {
			let isRemove = 0;

			$.each(this.removeTemp, (a, b) => {
				isRemove = 1;

				b.destroy();

				// if (a == this.removeTemp.length-1) {
				// }
			});

			if (isRemove) {
				setTimeout(() => { resolve("end") }, 500);
			} else {
				resolve("asd");
			}
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
					leftTop : baseData[val.x-1] == undefined ? undefined : baseData[val.x-1][val.y-1],
					leftBot : baseData[val.x-1] == undefined ? undefined : baseData[val.x-1][val.y+1],
					right : baseData[val.x+1] == undefined ? undefined : baseData[val.x+1][val.y],
					rightTop : baseData[val.x+1] == undefined ? undefined : baseData[val.x+1][val.y-1],
					rightBot : baseData[val.x+1] == undefined ? undefined : baseData[val.x+1][val.y+1]
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