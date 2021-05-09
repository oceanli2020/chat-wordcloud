import adbkit from 'adbkit'
import path from 'path'
import { getExecPath } from './format'

export default class Adb {
  static instance

  static tracker

  static adbPath

  constructor() {}

  static getInstance() {
    if (!this.instance) {
      const adbexec = process.platform === 'win32' ? 'adb.exe' : 'adb'
      this.adbPath = path.join(
        getExecPath(),
        'platform-tools',
        process.env.NODE_ENV === 'development'
          ? `${process.platform}/${adbexec}`
          : `${adbexec}`
      )
      this.instance = adbkit.createClient({
        bin: this.adbPath
      })
    }
    return this.instance
  }

  static getAdbPath() {
    return this.adbPath
  }

  static getAdbkit() {
    return adbkit
  }

  static setTracker(tracker) {
    this.tracker = tracker
  }

  static getTracker() {
    return this.tracker
  }
}
