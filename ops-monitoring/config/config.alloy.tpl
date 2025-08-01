local.file_match "local_files" {
  path_targets = [{"__path__" = "/var/log/*.log"}]
  sync_period = "5s"
}
loki.source.file "log_scrape" {
  targets    = local.file_match.local_files.targets
  forward_to = [loki.process.filter_logs.receiver]
  tail_from_end = true
}
loki.process "filter_logs" {
  stage.drop {
      source = ""
      expression  = ".*Connection closed by authenticating user root"
      drop_counter_reason = "noisy"
    }
  forward_to = [loki.write.grafana_loki.receiver]
}
loki.write "grafana_loki" {
  endpoint {
    url = "http://{monitoring_host}:3100/loki/api/v1/push"
    // basic_auth {
    //  username = "admin"
    //  password = "admin"
    // }
  }
}
prometheus.exporter.unix "local_system" { }

prometheus.scrape "scrape_metrics" {
  targets         = prometheus.exporter.unix.local_system.targets
  forward_to      = [prometheus.relabel.filter_metrics.receiver]
  scrape_interval = "10s"
}
prometheus.relabel "filter_metrics" {
  rule {
    action        = "drop"
    source_labels = ["env"]
    regex         = "dev"
  }
  forward_to = [prometheus.remote_write.metrics_service.receiver]
}
prometheus.remote_write "metrics_service" {
  endpoint {
    url = "http://{monitoring_host}:9090/api/v1/write"
    // basic_auth {
    //   username = "admin"
    //   password = "admin"
    // }
  }
}