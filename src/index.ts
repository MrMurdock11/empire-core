import "reflect-metadata";
import "core-js/stable";
import "regenerator-runtime/runtime";

import { Injectable } from "./decorators/injectable.decorator";
import { Command } from "./decorators/command.decorator";
import { Module } from "./decorators/module.decorator";

export { Injectable, Command, Module };
