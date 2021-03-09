export default  class pubsub {
	static music(arrayList,index){
		//订阅(接受)通信---type
		console.log(arrayList,index)
		return uni.$on('switchType',data => {
			console.log(arrayList,index)
			if(data.msg === 'pre'){
				(index === 0) && (index = arrayList.length);
				index -= 1;
			} else {
				(index === arrayList.length - 1) && (index = -1);
				index += 1;
			}
			this.index = index;
			let musicId = arrayList[index].id;
			// 发布(传递)通信---musicId
			uni.$emit('musicId',{
				msg:musicId
			})
		})
	}
}