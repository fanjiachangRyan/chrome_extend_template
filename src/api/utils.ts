const customStorage = {
  get: function (keys: string[], callback: (v: any) => void) {
    const values: any = {}
    try {
      keys.forEach((item: string) => {
        const _temp = localStorage.getItem(item)
        values[item] = _temp ? JSON.parse(_temp) : undefined
      })

      if (typeof callback === 'function') {
        callback(values)
      }

      return Promise.resolve(values)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  set: function (data: any, callback: (v: any) => void) {
    try {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const item = data[key]
          localStorage.setItem(key, JSON.stringify(item))
        }
      }

      if (typeof callback === 'function') {
        callback(data)
      }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  remove: function (key: string) {
    localStorage.removeItem(key)
  },
  clear: function () {
    localStorage.clear()
  },
}

export const storage = chrome?.storage?.local || customStorage

export const checkData = (list: any[]) => {
  if (!Array.isArray(list)) {
    return []
  }
  const data = list.filter((item: any) => (item.address ? true : false))

  return data
}


export const getCurrentTab = async () => {
  const queryOptions = { active: true, currentWindow: true }
  const [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

export const cutStr = (val: string, startLength = 6, endLength = 6) => {
  if (val.length < startLength + endLength) return val;

  return `${val.slice(0, startLength)}...${val.slice(0 - endLength)}`;
};

interface FormatCountByDenomFn {
  (
      denom: string,
      amount: string,
      isInt?: boolean,
      amountCutLength?: number,
  ): any

}

export const formatCountByDenom: FormatCountByDenomFn = (denom = '', amount: string, isInt = false, amountCutLength = 6) => {
  const firstChar = denom.slice(0, 1) || ''
  let newAmount = '0'
  if (firstChar.toUpperCase() === 'U') {
    newAmount = `${amount.slice(0, amount.length - amountCutLength)}`
    const amountLastStr = amount.slice(amount.length - amountCutLength, amount.length)
    const dotNumber = parseInt(amountLastStr)
    if (dotNumber > 0 && !isInt) {
      newAmount += ('.' + `${dotNumber / (10 ** amountCutLength)}`.split('.')[1])
    }

    return {
      denom: denom.slice(1, denom.length).toUpperCase(),
      amount: newAmount
    }
  }

  if (amountCutLength > 6) {
    newAmount = `${amount.slice(0, amount.length - (amountCutLength - 6))}`
  }

  return {
    denom: denom.toUpperCase(),
    amount: newAmount
  }
}
