"""
External Bazel dependencies
"""

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

def dependencies():
    """
    Installs all external dependencies so that they can be installed in the WORKSPACE file
    """

    # JavaScript and NodeJS rules
    # https://github.com/bazelbuild/rules_nodejs/releases
    http_archive(
        name = "build_bazel_rules_nodejs",
        sha256 = "6b951612ce13738516398a8057899394e2b7a779be91e1a68f75f25c0a938864",
        urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/5.0.0/rules_nodejs-5.0.0.tar.gz"],
    )

    # Rules for building and handling Docker images
    # https://github.com/bazelbuild/rules_docker/releases
    http_archive(
        name = "io_bazel_rules_docker",
        sha256 = "85ffff62a4c22a74dbd98d05da6cf40f497344b3dbf1e1ab0a37ab2a1a6ca014",
        strip_prefix = "rules_docker-0.23.0",
        urls = ["https://github.com/bazelbuild/rules_docker/releases/download/v0.23.0/rules_docker-v0.23.0.tar.gz"],
    )
