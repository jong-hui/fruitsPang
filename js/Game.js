

class Game {

	constructor () {

		this.Viewer = new View();
		this.GameBoarder = new GameBoard(this);

	}


	GameStart () {
		let status = this.initAttributes();

		if (!status) {
			return false;
		}

		this.Viewer.changePage(1);
		this.GameStartInit();
	}

	initAttributes () {
		let $nickname = $("#nickname");
		
		this.nickname = $nickname.val();
		this.stage = 0;
		this._score = 0;
		this._timer = 0;
		this.scoreInterval = 0;
		this.data = [];

		if (this.nickname == "") {
			$nickname.addClass('warning').outAnimate('warning');

			return false;
		}

		return true;
	}

	GameConfigLoad () {
		this.maxScore = Config.stageScore[this.stage];
		this.timer = this.maxTimer = Config.stageTimer[this.stage];
		this.score = 0;

		$("#text-nickname").text(this.nickname);
	}

	GameStartInit () {
		this.GameConfigLoad();

		this.stageUp(0);
	}

	stageUp (stage) {
		this.stage = stage;

		this.GameBoarder.stageAnimation(stage).then(() => {
			// 이때부터 컨트롤 가능
			
			this.GameTimerRefresh();
		});
	}

	GameTimerRefresh () {
		this.timerInterval = intervalMicro(() => {
			this.timer--;
		}, 1000);
	}

	nextStageChk () {

	}

	scoreAnimation (start, end) {
		let i = start;

		$("#text-score").text(i.toLocaleString());

		this.scoreInterval = new intervalMicro(() => {
			if (i >= end) {
				$("#text-score").text(end.toLocaleString());

				this.scoreInterval.stop();
				return false;
			}

			i += Math.ceil((end - start) / 100);

			$("#text-score").text(i.toLocaleString());
		}, 1);
	}

	get timer () {
		return this._timer;
	}

	set timer (newTimer) {
		this._timer = newTimer;

		let rect = (newTimer / this.maxTimer);
		$(".progress > div").css('width', (rect*100)+"%");
	}

	get score () {
		return this._score;
	}

	set score (newScore) {
		this.scoreAnimation(this.score, newScore);
		this._score = newScore;
		
		this.nextStageChk();

	}

	get stage () {
		return this._stage;
	}

	set stage (newStage) {
		this._stage = newStage;
	}

}