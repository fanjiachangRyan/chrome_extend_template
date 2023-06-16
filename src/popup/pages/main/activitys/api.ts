import {getTransMessageByAccount, getTransInfoByHash} from "@/api";

export const getTransInfo = (address: string, current: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res: any = await getTransMessageByAccount(address, current)
      const {data = [], amount = 0} = res ?? {}
      Promise.all(data.map(async (item: any) => {
        const transInfo: any = await getTransInfoByHash(item.transaction_hash)

        return transInfo

      })).then((list: any) => {
        resolve({
          amount,
          list
        })
      })
    } catch (e) {
      reject(e)
    }
  })
}
