export class SimpleExercise {
	constructor(title, body, illustrations=[]) {
		this._header = {title, body, illustrations}

		this.steps = []
	}

	get header() {
		return this._header
	}

	set header(value) {
		this._header = value
	}

	addStep(step) {
		this.steps.push(step)
		this.steps.map((step, i)=>step._id=i)
		return this
	}

	insertStep(step, pos) {
		this.steps.splice(pos, 0, step)
		this.steps.map((step, i)=>step._id=i)
		return this
	}

	addData(body, answer, title="", illustrations=[]){
		this.addStep(new SimpleExerciseStep(title, body, illustrations, answer))
		return this
	}

	insertData(body, answer, pos, title="", illustrations=[]){
		this.insertStep(new SimpleExerciseStep(title, body, illustrations, answer), pos)
		return this
	}
}

export class SimpleExerciseStep {
	constructor(title, body, illustrations=[], answer="") {
		this._id = -1
		this._title = title
		this._body = body
		this._illustrations = illustrations
		this._answer = answer
	}

	title(value){
		this._title = value
		return this
	}

	body(value){
		this._body = value
		return this
	}

	illustrations(...values){
		this._illustrations = values
		return this
	}

	answer(value){
		this._answer = value
		return this
	}

	get data(){
		return  {
			id: this._id,
			title: this._title,
			body: this._body,
			illustrations: this._illustrations,
			answer: this._answer
		}
	}

}
