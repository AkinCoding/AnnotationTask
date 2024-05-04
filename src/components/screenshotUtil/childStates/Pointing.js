import { StateNode } from '@tldraw/tldraw'

// There's a guide at the bottom of this file!

export class ScreenshotPointing extends StateNode {
	static id = 'pointing'

	// [1]
	onPointerMove = () => {
		if (this.editor.inputs.isDragging) {
			this.parent.transition('dragging')
		}
	}

	// [2]
	onPointerUp = () => {
		this.complete()
	}

	onCancel = () => {
		this.complete()
	}

	complete() {
		this.parent.transition('idle')
	}
}

/*
[1]
When the user makes a pointer move event, we check if they are dragging. If they are, 
we transition to the dragging state. If they are not yet dragging, we stay in this state.

[2]
When the user cancelles or makes a pointer up event (while this state is still active, 
so after the user has started pointing but before they've moved their pointer far enough 
to start dragging), then we transition back to the idle state.
*/