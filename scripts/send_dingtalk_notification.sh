#!/bin/bash

# 初始化变量
ENVIRONMENT=""
NOTIFICATION_TYPE=""
JOB_STATUS=""
ACCESS_TOKEN=""
ERROR_MESSAGE=""
ENV_URL=""
CI_PIPELINE_ID=""
CI_PIPELINE_URL=""

# 解析命名参数
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --environment) ENVIRONMENT="$2"; shift ;;
        --notification-type) NOTIFICATION_TYPE="$2"; shift ;;
        --job-status) JOB_STATUS="$2"; shift ;;
        --access-token) ACCESS_TOKEN="$2"; shift ;;
        --error-message) ERROR_MESSAGE="$2"; shift ;;
        --env-url) ENV_URL="$2"; shift ;;
        --pipeline-id) CI_PIPELINE_ID="$2"; shift ;;
        --pipeline-url) CI_PIPELINE_URL="$2"; shift ;;
        *) echo "未知参数: $1"; exit 1 ;;
    esac
    shift
done

# 检查必要的参数是否都已提供
if [[ -z "$ENVIRONMENT" || -z "$NOTIFICATION_TYPE" || -z "$JOB_STATUS" || -z "$ACCESS_TOKEN" ]]; then
    echo "错误：缺少必要的参数"
    exit 1
fi

# 脚本的其余部分保持不变
# ...

# 获取提交信息和当前时间
COMMIT_INFO=$(git log -n 5 --no-merges --pretty=format:"%h %s（%an）" | sed -z 's/\n/  \\n   /g')
CURRENT_TIME=$(date "+%Y-%m-%d %H:%M:%S")

# 根据状态设置颜色
if [ "$JOB_STATUS" = "start" ]; then
  STATUS="开始"
  COLOR="#52c41a"
elif [ "$JOB_STATUS" = "success" ]; then
  STATUS="成功"
  COLOR="#52c41a"
elif [ "$JOB_STATUS" = "failed" ]; then
  STATUS="失败"
  COLOR="#f5222d"
elif [ "$JOB_STATUS" = "canceled" ]; then
  STATUS="已取消"
  COLOR="#faad14"
else
  STATUS="进行中"
  COLOR="#faad14"
fi

# 构建消息内容
MESSAGE="# [${NOTIFICATION_TYPE}](${CI_PIPELINE_URL})\n---\n"
MESSAGE+="- 状态：<font color='${COLOR}'>${STATUS}</font>\n"
MESSAGE+="- 项目：业务系统\n"
MESSAGE+="- 环境：${ENVIRONMENT}\n"
MESSAGE+="- 分支：${CI_COMMIT_REF_NAME}\n"
MESSAGE+="- 执行时间：${CURRENT_TIME}\n"
MESSAGE+="- 执行人：${GITLAB_USER_NAME}\n"
MESSAGE+="- 流水线 ID：[#${CI_PIPELINE_ID}](${CI_PIPELINE_URL})\n"
MESSAGE+="- 最新提交内容:  \n  ${COMMIT_INFO}"

# 如果有错误信息，添加到消息中
if [ -n "$ERROR_MESSAGE" ]; then
  MESSAGE+="\n\n错误详情：${ERROR_MESSAGE}"
fi

# 发送钉钉通知
curl 'https://oapi.dingtalk.com/robot/send?access_token='${ACCESS_TOKEN} \
  -H 'Content-Type: application/json' \
  -d '{
    "msgtype": "actionCard",
    "actionCard": {
      "title": "部署通知",
      "text": "'"${MESSAGE}"'",
      "hideAvatar": "0",
      "btnOrientation": "1",
      "btns": [
        {
          "title": "'"${ENVIRONMENT}"'",
          "actionURL": "dingtalk://dingtalkclient/page/link?url='"${ENV_URL}"'&pc_slide=false"
        },
        {
          "title": "GitLab流水线",
          "actionURL": "dingtalk://dingtalkclient/page/link?url='"${CI_PIPELINE_URL}"'&pc_slide=false"
        }
      ]
    }
  }'