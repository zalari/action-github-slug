import * as core from '@actions/core'
import {slugref, slugurl, slugurlref, shortsha} from './slug'

async function run(): Promise<void> {
  try {
    const maxLength = getParsedMaxOrDefault()

    const eventPath = process.env['GITHUB_EVENT_PATH']
    if (eventPath) {
      const eventData = await import(eventPath)
      if (eventData.hasOwnProperty('ref')) {
        core.exportVariable(
          'GITHUB_EVENT_REF_SLUG',
          slugref(eventData.ref, maxLength)
        )
        core.exportVariable(
          'GITHUB_EVENT_REF_SLUG_URL',
          slugurlref(eventData.ref, maxLength)
        )
      }
    }

    exportSlugRef('GITHUB_REPOSITORY_SLUG', 'GITHUB_REPOSITORY')
    exportSlug('GITHUB_REPOSITORY_SLUG_URL', 'GITHUB_REPOSITORY')

    exportSlugRef('GITHUB_REF_SLUG', 'GITHUB_REF')
    exportSlugRef('GITHUB_HEAD_REF_SLUG', 'GITHUB_HEAD_REF')
    exportSlugRef('GITHUB_BASE_REF_SLUG', 'GITHUB_BASE_REF')

    exportSlugUrlRef('GITHUB_REF_SLUG_URL', 'GITHUB_REF')
    exportSlugUrlRef('GITHUB_HEAD_REF_SLUG_URL', 'GITHUB_HEAD_REF')
    exportSlugUrlRef('GITHUB_BASE_REF_SLUG_URL', 'GITHUB_BASE_REF')

    exportShortSha('GITHUB_SHA_SHORT', 'GITHUB_SHA')
  } catch (error) {
    core.setFailed(error.message)
  }
}

function getParsedMaxOrDefault(): number {
  const inputMaxLength = core.getInput('maxLength')
  const parsedMax = parseInt(inputMaxLength)
  if (!isNaN(parsedMax) && parsedMax > 1) {
    return parsedMax < 63 ? parsedMax : 63
  }
  return 63
}

function exportSlugRef(ouputKey: string, inputKey: string): void {
  const maxLength = getParsedMaxOrDefault()
  const envVar = process.env[inputKey]
  if (envVar) {
    core.exportVariable(ouputKey, slugref(envVar, maxLength))
  }
}

function exportSlug(ouputKey: string, inputKey: string): void {
  const envVar = process.env[inputKey]
  if (envVar) {
    core.exportVariable(ouputKey, slugurl(envVar))
  }
}

function exportSlugUrlRef(ouputKey: string, inputKey: string): void {
  const maxLength = getParsedMaxOrDefault()
  const envVar = process.env[inputKey]
  if (envVar) {
    core.exportVariable(ouputKey, slugurlref(envVar, maxLength))
  }
}

function exportShortSha(ouputKey: string, inputKey: string): void {
  const envVar = process.env[inputKey]
  if (envVar) {
    core.exportVariable(ouputKey, shortsha(envVar))
  }
}

run()
