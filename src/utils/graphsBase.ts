import uPlot from 'uplot'

export function reactDataChange (vm: ChartComponents, oldData, newData, stack = false) {
	if (oldData == null || !vm.chart) {
		if (vm.chart) vm.destroyChart()
		vm.createChart(newData)
	} else {
		if (oldData[0].length !== newData[0].length) {
			vm.destroyChart()
			vm.createChart(newData)
		} else if (!vm.hovered) {
			const data = stack && vm.stack ? vm.stack(newData, i => !vm.chart.series[i].show).data : newData
			vm.chart.setData(data)
		}
	}

	// Update the legend to the latest value
	if (!vm.hovered) vm.chart.setLegend({ idx: newData[1].length - 1 }, false)
}

export function customLegend (vm: ChartComponents) {
	return {
		hooks: {
			init: function (u) {
				const legendEl = u.root.querySelector('.u-legend')
				// Get the u-series corresponding to the Timestamp
				const time = legendEl.getElementsByClassName('u-series')[0]
				// Remove first elem of time, which is just the label "Time"
				time.firstChild.remove()
				// Assign some style change
				uPlot.assign(time.firstChild.style, {
					fontSize: '14px',
					color: 'rgb(189, 189, 193)'
				})
				// Create unit item - and insert it before time.firstChild
				const unit = document.createElement('td')
				const content = document.createTextNode(vm.unit)
				unit.appendChild(content)
				time.insertBefore(unit, time.firstChild)

				// Assign some style change
				uPlot.assign(time.style, {
					width: '100%',
					display: 'flex',
					webkitBoxPack: 'justify',
					justifyContent: 'space-between'
				})
				uPlot.assign(time.firstChild.style, {
					fontSize: '14px',
					color: 'rgb(189, 189, 193)'
				})
				uPlot.assign(legendEl.style, {
					paddingLeft: '38px',
					paddingRight: '20px'
				})
			}
		}
	}
}

export function initMouseEvent (vm: ChartComponents) {
	// get the over part of the Graph as per uPlot doc
	const elems = vm.$el.getElementsByClassName('u-over')

	// Add mouseleave event
	elems.item(0).addEventListener('mouseleave', () => {
		vm.hovered = false
		vm.chart.setLegend({ idx: vm.chartdata[1].length - 1 }, false)
	})
	// Add mouseenter event
	elems.item(0).addEventListener('mouseenter', () => {
		vm.hovered = true
	})
}
