import { StateNode } from '@tldraw/editor';

export class Idle extends StateNode {
	static id = 'idle'

	onPointerMove = (info) => {
		switch (info.target) {
			case 'shape':
			// case 'canvas': {
			// 	updateHoveredId(this.editor)
			// }
		}
	}

	onPointerDown = (info) => {
		this.parent.transition('pointing', info)
	}

	onEnter = () => {
		this.editor.setCursor({ type: 'cross', rotation: 0 })
	}

	onKeyDown = (info) => {
		if (info.key === 'Enter') {
			if (this.editor.getInstanceState().isReadonly) return null
			const onlySelectedShape = this.editor.getOnlySelectedShape()
			// If the only selected shape is editable, start editing it
			if (
				onlySelectedShape &&
				this.editor.getShapeUtil(onlySelectedShape).canEdit(onlySelectedShape)
			) {
				this.editor.setCurrentTool('select')
				this.editor.setEditingShape(onlySelectedShape.id)
				this.editor.root.getCurrent()?.transition('editing_shape', {
					...info,
					target: 'shape',
					shape: onlySelectedShape,
				})
			}
		}
	}

	onCancel = () => {
		this.editor.setCurrentTool('select')
	}
}
