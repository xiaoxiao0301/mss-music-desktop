package config

import (
	"github.com/spf13/viper"
)

type Config struct {
    Server struct {
        BaseURL string `mapstructure:"base_url"`
        BasePort int    `mapstructure:"base_port"`
    } `mapstructure:"server"`
}

func LoadConfig() (*Config, error) {
    viper.SetConfigName("config")   // 文件名，不带扩展名
    viper.SetConfigType("yaml")
    viper.AddConfigPath("./config") // 指定查找路径

    if err := viper.ReadInConfig(); err != nil {
        return nil, err
    }

    var cfg Config
    if err := viper.Unmarshal(&cfg); err != nil {
        return nil, err
    }
    return &cfg, nil
}
