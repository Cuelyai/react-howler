import React, { useEffect, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { Howl } from './howler'
import { noop } from './utils'

function usePrevious (value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

function ReactHowler (props) {
  const prevProps = usePrevious({ mute, volume })

  const howler = useMemo(() => {
    return new Howl({
      src: props.src,
      xhr: props.xhr,
      format: props.format,
      mute: props.mute,
      loop: props.loop,
      preload: props.preload,
      volume: props.volume,
      rate: props.rate,
      onend: props.onEnd,
      onplay: props.onPlay,
      onplayerror: props.onPlayError,
      onpause: props.onPause,
      onvolume: props.onVolume,
      onstop: props.onStop,
      onload: props.onLoad,
      onseek: props.onSeek,
      onloaderror: props.onLoadError,
      html5: props.html5
    })
  }, [])

  useEffect(() => {
    toggleHowler()

    return () => destroyHowler()
  }, [])

  /**
   * Stop, unload and destroy howler object
   */
  function destroyHowler () {
    if (howler) {
      howler.off() // Remove event listener
      howler.stop() // Stop playback
      howler.unload() // Remove sound from pool
    }
  }

  function toggleHowler () {
    props.playing ? play() : pause()
    loop(props.loop)

    if (prevProps.mute !== props.mute) {
      mute(props.mute)
    }

    if (prevProps.volume !== props.volume) {
      volume(props.volume)
    }

    if (props.preload && howlerState() === 'unloaded') {
      load()
    }
  }

  function play () {
    const playing = howler.playing()

    if (!playing) {
      // Automatically load if we're trying to play
      // and the howl is not loaded
      if (howlerState() === 'unloaded') {
        load()
      }

      howler.play()
    }
  }

  function pause (id = undefined) {
    if (id) {
      howler.pause(id)
    } else {
      howler.pause()
    }
  }

  function howlerState () {
    return howler.state()
  }

  function mute (...args) {
    howler.mute(...args)
  }

  function volume (...args) {
    return howler.volume(...args)
  }

  function loop (...args) {
    return howler.loop(...args)
  }

  function load () {
    howler.load()
  }

  return <div />
}

ReactHowler.propTypes = {
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
  format: PropTypes.arrayOf(PropTypes.string),
  xhr: PropTypes.object,
  playing: PropTypes.bool,
  mute: PropTypes.bool,
  loop: PropTypes.bool,
  preload: PropTypes.bool,
  volume: PropTypes.number,
  rate: PropTypes.number,
  onEnd: PropTypes.func,
  onPause: PropTypes.func,
  onPlay: PropTypes.func,
  onPlayError: PropTypes.func,
  onVolume: PropTypes.func,
  onStop: PropTypes.func,
  onLoad: PropTypes.func,
  onSeek: PropTypes.func,
  onLoadError: PropTypes.func,
  html5: PropTypes.bool
}

ReactHowler.defaultProps = {
  playing: true, // Enable autoplay by default
  format: [],
  xhr: {},
  mute: false,
  preload: true,
  loop: false,
  volume: 1.0,
  rate: 1,
  onEnd: noop,
  onPause: noop,
  onPlay: noop,
  onPlayError: noop,
  onVolume: noop,
  onStop: noop,
  onLoad: noop,
  onSeek: noop,
  onLoadError: noop,
  html5: false
}

export default ReactHowler
