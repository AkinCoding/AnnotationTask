import { StateNode, createShapeId } from '@tldraw/editor'

export class Pointing extends StateNode {
	static id = 'pointing'

	shape

	markId = ''

	onExit = () => {
		this.editor.setHintingShapes([])
	}

	onPointerMove = (info) => {
		if (this.editor.inputs.isDragging) {
			const {
				inputs: { originPagePoint },
			} = this.editor

			const id = createShapeId()

			this.markId = `creating:${id}`
			this.editor.mark(this.markId)

			this.editor.createShapes([
				{
					id,
					type: 'label',
					x: originPagePoint.x,
					y: originPagePoint.y,
					props: {
						text: '',
						autoSize: false,
						w: 20,
					},
				},
			])

			this.editor.select(id)

			this.shape = this.editor.getShape(id)
			if (!this.shape) return

			const { shape } = this

			this.editor.setCurrentTool('select.resizing', {
				...info,
				target: 'selection',
				handle: 'right',
				isCreating: true,
				creationCursorOffset: { x: 1, y: 1 },
				onInteractionEnd: 'label',
				onCreate: () => {
					this.editor.setEditingShape(shape.id)
					this.editor.setCurrentTool('select.editing_shape')
				},
			})
		}
	}

	onPointerUp = () => {
		this.complete()
	}

	onComplete = () => {
		this.cancel()
	}

	onCancel = () => {
		this.cancel()
	}

	onInterrupt = () => {
		this.cancel()
	}

	complete() {
		this.editor.mark('creating text shape')
		const id = createShapeId()
		const { x, y } = this.editor.inputs.currentPagePoint
		this.editor
			.createShapes([
				{
					id,
					type: 'label',
					x,
					y,
					props: {
						text: '',
						autoSize: true,
					},
				},
			])
			.select(id)

		this.editor.setEditingShape(id)
		this.editor.setCurrentTool('select')
		this.editor.root.getCurrent()?.transition('editing_shape')
	}

	cancel() {
		this.parent.transition('idle')
		this.editor.bailToMark(this.markId)
	}
}
