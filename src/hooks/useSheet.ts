import { type SheetAOAOpts, utils, writeFileXLSX, read } from 'xlsx'

interface IConfigImportXLSX {
  sheetsName?: string[]
}

export function useSheet() {
  async function exportXLSX<T>(
    rows: Array<T>,
    headers: Array<string[]>,
    fileName: string,
    bookName: string,
    optionsSheet: SheetAOAOpts,
    extension: '.xlsx',
  ) {
    const worksheet = utils.json_to_sheet(rows)

    const workbook = utils.book_new()

    utils.book_append_sheet(workbook, worksheet, bookName)

    utils.sheet_add_aoa(worksheet, [...headers], optionsSheet)

    await writeFileXLSX(workbook, `${fileName}${extension}`)
  }

  async function importXLSX(file: File, config?: IConfigImportXLSX) {
    const arrayBuffer = await file.arrayBuffer()
    const workbook = read(new Uint8Array(arrayBuffer), { type: 'array' })
    const dataJson = []

    const sheetNames = config?.sheetsName
      ? workbook.SheetNames.filter((sheet) => {
          return config.sheetsName?.includes(sheet)
        })
      : workbook.SheetNames

    for (const sheetName of sheetNames) {
      if (!sheetName) return
      const worksheet = workbook.Sheets[sheetName]
      if (!worksheet) return

      dataJson.push({
        sheetName,
        data: utils.sheet_to_json(worksheet),
      })
    }

    return dataJson
  }

  return {
    exportXLSX,
    importXLSX,
  }
}
