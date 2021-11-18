import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 加密
export function encrypt(txt, publicKey) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
//   encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}

/**
 * 获取两个对象数组的差集
 * @param allArr：全数组
 * @param partArr：缺省数组
 *  */  

export function getDifferentArr (allArr, partArr) {
	for (let i = allArr.length - 1; i >= 0; i--) {
		for (let j = 0; j  < partArr.length; j++) {
			if (allArr[i].path === partArr[j].path) {
				allArr.splice(i, 1);
				break;
			}
		}
	}
	return allArr;
}

export function streamToExcel(data, name, type = 'xlsx') {
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', `${name}.${type}`)
  document.body.appendChild(link)
  link.click()
}

// 根据key获取数组value
export function getArrayProps (arr, key) {
	const keys = `${key}`
	const res = []
	if (arr.length > 0) {
		arr.forEach(t => {
			res.push(t[keys])
		})
	}
	return res
  }


// 数组转对象
export const arrToObj = arr => {
    const obj = {}
    if(arr.length > 0) {
      arr.map((item) => {
        obj[item.value] = item.label
       })
      return obj
    }
    return null
}

// 车辆数组转对象
export const carArrToObj = arr => {
	const obj = {}
    if(arr.length > 0) {
      arr.map((item) => {
        obj[item.id] = item.carNumber
       })
      return obj
    }
    return null
}

// 人员数组转对象
export const personArrToObj = arr => {
	const obj = {}
    if(arr.length > 0) {
      arr.map((item) => {
        obj[item.workersId] = item.workName
       })
      return obj
    }
    return null
}
// 防抖函数
export const debounce = (fun,delay)=>{
  let timer = null
  return function(){
    clearInterval(timer)
    var context =this;
    var args = arguments
    timer = setTimeout(() => {
      fun.call(context,args)
    }, delay);
  }
}

// tree转list
export const treeToList = (tree, result = [], level = 0) => {
  if(Array.isArray(tree)) {
    tree.forEach(node => {
    result.push(node)
    node.level = level + 1
    node.children && treeToList(node.children, result, level + 1)
   }) 
  }
  return result
}

// 将秒转化为时分秒
export const formatSeconds = (value) => {
  let result = parseInt(value)
  let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
  let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
  let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));

  let res = '';
  if(h !== '00') res += `${h}时`;
  if(m !== '00') res += `${m}分`;
  res += `${s}秒`;
  return res;
}