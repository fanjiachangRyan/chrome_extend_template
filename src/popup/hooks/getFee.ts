import {useState} from "react";
import {useRequest} from "ahooks";
import {getTransitionList} from "@/api";

function useGetFee() {
  const [gas, setGas] = useState<number>(0)

  useRequest(() => getTransitionList(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      const {data = []} = res
      const _gasUsed = data.map((item: any) => item.gas_used)

      _gasUsed.sort((a: number, b: number) => a - b)
      _gasUsed.pop()
      _gasUsed.shift()

      const total = _gasUsed.reduce((prev: number, gas: number) => {
        prev += gas

        return prev
      }, 0)

      const avage: number = parseInt(`${total / 18 * 1.7}`)

      setGas(avage)
    }
  })

  return {gas}
}

export default useGetFee
