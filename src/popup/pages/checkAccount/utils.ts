import {getCurrentAccount} from "@/api";
import {EXISTLOCALACCOUNT} from "@/popup/define";

export const checkAccount = () => {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      const account: any = await getCurrentAccount()
      if (!account.address) {
        resolve({type: EXISTLOCALACCOUNT.NOTEXIST})
        return
      }

      resolve({type: EXISTLOCALACCOUNT.EXIST})
    } catch (e) {
     reject(e)
    }
  })
}
