const events = {
    'OffBMap': [
        'click',
        'dblclick',
        'rightclick',
        'rightdblclick',
        'maptypechange',
        'mousemove',
        'mouseover',
        'mouseout',
        'movestart',
        'moving',
        'moveend',
        'zoomstart',
        'zoomend',
        'addoverlay',
        'addcontrol',
        'removecontrol',
        'removeoverlay',
        'clearoverlays',
        'dragstart',
        'dragging',
        'dragend',
        'addtilelayer',
        'removetilelayer',
        'load',
        'resize',
        'hotspotclick',
        'hotspotover',
        'hotspotout',
        'tilesloaded',
        'touchstart',
        'touchmove',
        'touchend',
        'longpress'
    ],
    'BMarker': [
        'click',
        'dblclick',
        'mousedown',
        'mouseup',
        'mouseout',
        'mouseover',
        'remove',
        'infowindowclose',
        'infowindowopen',
        'dragstart',
        'dragging',
        'dragend',
        'rightclick'
    ],

    'BInfo': [
        'close',
        'open',
        'maximize',
        'restore',
        'clickclose'
    ],

    'BLine': [
        'click',
        'dblclick',
        'mousedown',
        'mouseup',
        'mouseout',
        'mouseover',
        'remove',
        'lineupdate'
    ],

    'BLabel': [
        'click',
        'dblclick',
        'mousedown',
        'mouseup',
        'mouseout',
        'mouseover',
        'remove',
        'rightclick'
    ],
}


export const bindE = function (instance, eventList) {
    const ev = eventList || events[this.$options.name]
    ev && ev.forEach(event => {
      const hasOn = event.slice(0, 2) === 'on'
      const eventName = hasOn ? event.slice(2) : event
      const listener = this.$listeners[eventName];
      listener && instance.addEventListener(event, listener.fns)
    })
};
  