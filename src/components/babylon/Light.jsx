import {createEffect, onCleanup } from 'solid-js'
import * as BABYLON from '@babylonjs/core'

import { getScene } from '../../Scene'

export const Light = () => {
  createEffect(async () => {
    console.log('Light.tsx: createEffect')

    const scene = await getScene()
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(0, 1, 0),
      scene
    )

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7

    onCleanup(() => {
      console.log('Light.tsx: onCleanup')
      light.dispose()
    })
  })

  return null
}
