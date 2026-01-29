import { useState, useEffect } from "react"
import { Form, Input, Button, message } from "antd"
import { SendOtp, Login } from "../../wailsjs/go/backend/AuthBridge"
import { useNavigate } from "react-router-dom"

import "../styles/loginPageStyle.css"

message.config({
  top: 80,
  duration: 2,
  maxCount: 1,
  zIndex: 99999
})

export default function LoginPage() {
  const [form] = Form.useForm()
  const phoneValue = Form.useWatch("phone", form)
  const codeValue = Form.useWatch("code", form)

  const [cooldown, setCooldown] = useState(0)
  const [loginCooldown, setLoginCooldown] = useState(0)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  // 验证码倒计时
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  // 登录冷却倒计时
  useEffect(() => {
    if (loginCooldown > 0) {
      const timer = setTimeout(() => setLoginCooldown(loginCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [loginCooldown])

  // 手机号校验
  const validatePhone = (phone) => /^1[3-9]\d{9}$/.test(phone)

  // 获取验证码
  const handleGetCode = async () => {
    const phone = form.getFieldValue("phone")

    if (!validatePhone(phone)) {
      message.error("请输入正确的手机号")
      return
    }

    if (cooldown > 0) return

    try {
      await SendOtp(phone)
      message.success("验证码已发送")
      setCooldown(60)
    } catch (err) {
      const msg = String(err)

      // 提取 JSON 部分
      const jsonStart = msg.indexOf("{")
      const jsonStr = msg.slice(jsonStart)

      let errResp = {}
      try {
        errResp = JSON.parse(jsonStr)
      } catch (e) {
        console.error("解析错误信息失败:", msg)
        message.error("短信发送失败")
      }

      if (errResp.code === 42900) {
        message.error("5分钟后再尝试")
      } else {
        message.error("发送验证码失败")
      }
    }

  }

  // 登录
  const handleLogin = async (values) => {
    if (loginCooldown > 0) {
      message.warning(`请等待 ${loginCooldown} 秒后再尝试登录`)
      return
    }

    const { phone, code } = values

    if (!validatePhone(phone)) {
      message.error("请输入正确的手机号")
      return
    }

    if (!code) {
      message.error("请输入验证码")
      return
    }

    setLoading(true)

    try {
      await Login(phone, code)
      message.success("登录成功")
      setLoginCooldown(300)
      // ⭐ 登录成功后跳转到首页
      navigate("/home")
    } catch (err) {
      message.error("登录失败，请检查手机号和验证码")
    } finally {
      setLoading(false)
    }
  }

  // 是否允许点击“获取验证码”
  const canSendCode = validatePhone(phoneValue || "")

  // 是否允许点击“登录”
  const canLogin = validatePhone(phoneValue || "") && (codeValue || "").length > 0

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-title">欢迎回来</div>

        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[{ required: true, message: "请输入手机号" }]}
          >
            <Input placeholder="请输入手机号" maxLength={11} />
          </Form.Item>

          <Form.Item label="验证码" required>
            <div style={{ display: "flex", gap: 10 }}>
              <Form.Item
                name="code"
                noStyle
                rules={[{ required: true, message: "请输入验证码" }]}
              >
                <Input placeholder="验证码" />
              </Form.Item>

              <Button
                type="primary"
                disabled={!canSendCode || cooldown > 0}
                onClick={handleGetCode}
              >
                {cooldown > 0 ? `${cooldown}s` : "获取验证码"}
              </Button>
            </div>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            disabled={!canLogin || loginCooldown > 0}
          >
            {loginCooldown > 0 ? `请等待 ${loginCooldown}s` : "登录"}
          </Button>
        </Form>
      </div>
    </div>
  )
}
