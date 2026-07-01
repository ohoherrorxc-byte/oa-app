import meetingApi from '@/api/meeting/index'

export default class Operate {
    static endMeeting(that, row) {
        that.$confirm('你确定结束会议吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            let obj = {
                id: row.id,
                conferenceStatus: 2//   状态 0:未开始、1:进行中、2:结束、3:已取消             
            }
            let res = await meetingApi.updateStatus(obj)
            console.log(res)
            if (res.data.code === 0) {
                that.$message({
                    type: 'success',
                    message: '会议已结束!'
                });
            }

        }).catch(() => {
            that.$message({
                type: 'info',
                message: '已取消'
            });
        });
    }
    static delayMeeting(that) {
        console.log(that.$refs.delayMeeting)
        that.$refs.delayMeeting.dialogVisibleTimer = true
        
    }
    static delaySubmit(that) {
        that.$refs.ruleForm.validate((valid) => {
            if (valid) {
                // alert('submit!');
            } else {

            }
        })
    }
    static meetingWrite(that,row) {
        that.$refs.meetingSummary.dialogVisibleSummary = true
        that.$refs.meetingSummary.getDetail(row.id)
    }
    static meetingFiles(that,row){
        console.log(row)
        that.$refs.meetingFiles.dialogVisibleFiles = true
        that.$refs.meetingFiles.getDetail(row.id)
    }
    static cancelMeeting(that,row) {
        that.$confirm('你确定取消会议吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async() => {
            let obj = {
                id: row.id,
                conferenceStatus: 3//   状态 0:未开始、1:进行中、2:结束、3:已取消             
            }
            let res = await meetingApi.updateStatus(obj)
            console.log(res)
            if (res.data.code === 0) {
                that.$message({
                    type: 'success',
                    message: '会议已取消!'
                });
            }
        }).catch(() => {
            // that.$message({
            //     type: 'info',
            //     message: '已取消'
            // });
        });
    }
    static updateMeeting(that, id, type,entry) {
        console.log(entry+"entry")
        that.$emit('toDetail', 'add', id, type,entry)
    }



}
