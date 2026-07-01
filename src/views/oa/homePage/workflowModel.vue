<template>
	<div id="workflow-app">
		<div v-if="showModal" class="modal-overlay" @click="closeModal">
			<div class="modal-content" @click.stop>
				<div class="modal-header">
					<span>工作流统计</span>
					<span class="update-time">更新时间：{{ updateTime || '-' }}</span>
				</div>
				<div class="modal-body">
					<div class="stat-grid">
						<div class="stat-item">
							<div class="stat-label">待办流程</div>
							<div class="stat-value" @click="toFlow">{{ waitFlowCount != null && waitFlowCount !== '' ? waitFlowCount : '-' }}</div>
						</div>
						<div class="stat-item">
							<div class="stat-label">BUG数量</div>
							<div class="stat-value">{{ bugCount != null && bugCount !== '' ? bugCount : '-' }}</div>
						</div>
						<div class="stat-item">
							<div class="stat-label">CR数量</div>
							<div class="stat-value">{{ crCount != null && crCount !== '' ? crCount : '-' }}</div>
						</div>
						<div class="stat-item">
							<div class="stat-label">应出勤天数</div>
							<div class="stat-value">{{ mouthShouldDays != null && mouthShouldDays !== '' ? mouthShouldDays : '-' }}</div>
						</div>
						<div class="stat-item">
							<div class="stat-label">出勤天数</div>
							<div class="stat-value">{{ realDay != null && realDay !== '' ? realDay : '-' }}</div>
						</div>
						<div class="stat-item">
							<div class="stat-label">请假</div>
							<div class="stat-value">{{ leaveDay != null && leaveDay !== '' ? leaveDay : '-' }}</div>
						</div>
						<div class="stat-item">
							<div class="stat-label">调休</div>
							<div class="stat-value">{{ restDay != null && restDay !== '' ? restDay : '-' }}</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="modal-btn cancel" @click="closeModal">知道了</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
			return {
				showModal: true,
				waitFlowCount: null,
				bugCount: null,
				crCount: null,
				mouthShouldDays: null,
				realDay: null,
				leaveDay: null,
				restDay: null,
				updateTime: ''
			};
		},
		mounted() {
			this.getUserWorkStatusInfo();
		},
	methods: {
			closeModal() {
				this.showModal = false;
			},
			toFlow() {
				this.$router.push('/oa/myFlow/index');
				this.closeModal();
			},
			getUserWorkStatusInfo() {
				this.$axios.get('/api/oa-user/v2.0/getUserWorkStatusInfo').then(res => {
					if (res.code === 0) {
						const data = res.data;
						this.waitFlowCount = data.waitFlowCount || 0;
						this.bugCount = data.bugCount || 0;
						this.crCount = data.crCount || 0;
						this.mouthShouldDays = data.mouthShouldDays || 0;
						this.realDay = data.realDay || 0;
						this.leaveDay = data.leaveDay || 0;
						this.restDay = data.restDay || 0;
						this.updateTime = new Date().toLocaleString('zh-CN', {
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit'
						});
					}
				}).catch(error => {
					console.error('获取用户工作状态信息失败:', error);
				});
			}
		}
};
</script>

<style>
#workflow-app {
	display: block;
}

.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	backdrop-filter: blur(8px);
	animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

.modal-content {
	background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
	border-radius: 16px;
	padding: 28px;
	width: 100%;
	max-width: 520px;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
	border: 1px solid rgba(255, 255, 255, 0.2);
	animation: slideUp 0.4s ease-out;
	overflow: hidden;
	box-sizing: border-box;
}

@keyframes slideUp {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.modal-header {
	font-size: 20px;
	font-weight: 600;
	color: #1e293b;
	margin-bottom: 24px;
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.update-time {
	font-size: 12px;
	color: #94a3b8;
	font-weight: 400;
}

.modal-header::after {
	content: '';
	position: absolute;
	bottom: -12px;
	left: 50%;
	transform: translateX(-50%);
	width: 60px;
	height: 3px;
	background: linear-gradient(90deg, #3b82f6, #8b5cf6);
	border-radius: 2px;
}

.modal-body {
	margin-bottom: 24px;
}

.stat-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 12px;
}

.stat-grid .stat-item:nth-child(1) {
	grid-column: 1 / -1;
	width: 100%;
	max-width: none;
}

.stat-grid .stat-item:nth-child(2),
.stat-grid .stat-item:nth-child(3) {
	grid-column: span 1;
}

.stat-grid .stat-item:nth-child(4),
.stat-grid .stat-item:nth-child(5) {
	grid-column: span 1;
}

.stat-grid .stat-item:nth-child(6),
.stat-grid .stat-item:nth-child(7) {
	grid-column: span 1;
}

.stat-item {
	background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
	border: 1px solid rgba(59, 130, 246, 0.1);
	border-radius: 12px;
	padding: 20px 16px;
	text-align: center;
	position: relative;
	overflow: hidden;
	transition: all 0.3s ease;
	box-sizing: border-box;
	word-break: break-word;
}

.stat-item::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 3px;
	background: linear-gradient(90deg, #3b82f6, #8b5cf6);
	opacity: 0;
	transition: opacity 0.3s ease;
}

.stat-item:hover {
	transform: translateY(-4px);
	box-shadow: 0 12px 24px rgba(59, 130, 246, 0.15);
}

.stat-item:hover::before {
	opacity: 1;
}

.stat-label {
	font-size: 13px;
	color: #64748b;
	margin-bottom: 8px;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.stat-value {
	font-size: 24px;
	font-weight: 700;
	background: linear-gradient(135deg, #3b82f6, #8b5cf6);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.stat-grid .stat-item:nth-child(1) .stat-value {
	font-size: 30px;
	cursor: pointer;
	transition: all 0.3s ease;
}

.stat-grid .stat-item:nth-child(1) .stat-value:hover {
	transform: scale(1.05);
	opacity: 0.8;
}

.modal-footer {
	display: flex;
	justify-content: center;
}

.modal-btn {
	padding: 10px 20px;
	border: none;
	border-radius: 12px;
	cursor: pointer;
	font-size: 13px;
	font-weight: 500;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
	box-sizing: border-box;
	max-width: 100%;
}

.modal-btn.cancel {
	background: linear-gradient(135deg, #ef4444, #dc2626);
	color: white;
	box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.modal-btn.cancel:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
}

.modal-btn.cancel:active {
	transform: translateY(0);
}

.modal-btn.cancel::before {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	width: 0;
	height: 0;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 50%;
	transform: translate(-50%, -50%);
	transition: width 0.6s, height 0.6s;
}

.modal-btn.cancel:hover::before {
	width: 300px;
	height: 300px;
}
</style>
