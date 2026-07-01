export function checkPasswordStrength(password, language = 'cn') {
    const minLength = 10;
    let strength = 0;
    let message = {
        en: "Can be stronger",
        cn: "还可以更强"
    };

    // 检查长度 / Check length
    if (password.length < minLength) {
        return {
            strength: { en: "Weak", cn: "弱" },
            message: {
                en: "Password length must be at least " + minLength + " characters",
                cn: "密码长度至少需要 " + minLength + " 个字符"
            }
        };
    }

    // 检查字符类型 / Check character types
    if (password.match(/[a-z]/)) strength += 1;  // 小写字母 / Lowercase letters
    if (password.match(/[A-Z]/)) strength += 1;  // 大写字母 / Uppercase letters
    if (password.match(/[0-9]/)) strength += 1;  // 数字 / Numbers
    if (password.match(/[^a-zA-Z0-9]/)) strength += 1;  // 特殊字符 / Special characters

    // 检查常见弱密码特征 / Check common weak password patterns
    const weakPatterns = [
        /qwe|asd|zxc|123|321|abc|qaz|wsx|edc|rfv|tgb|yhn|ujm|ikm|olp/i, // 键盘模式 / Keyboard patterns
        /password|pass/i, // 常见单词 / Common words
        /(.)\1{2,}/ // 连续重复字符 / Repeated characters
    ];

    const lowerPassword = password.toLowerCase();
    let isPatternBased = false;
    weakPatterns.forEach(pattern => {
        if (pattern.test(password) || pattern.test(lowerPassword)) {
            isPatternBased = true;
            message = {
                en: "Password contains common patterns or words, suggest changing",
                cn: "密码包含常见键盘模式或单词，建议更换"
            };
        }
    });

    // 检查长度和模式综合评分 / Comprehensive scoring based on length and patterns
    if (isPatternBased || password.length < 12) {
        if (strength >= 2) {
            return {
                strength: { en: "Medium", cn: "中等" },
                message: message
            };
        } else {
            return {
                strength: { en: "Weak", cn: "弱" },
                message: {
                    en: "Suggest using more character types and avoiding common patterns",
                    cn: "建议使用更多类型字符并避免常见模式"
                }
            };
        }
    }

    // 根据字符类型评分 / Score based on character types
    switch (strength) {
        case 1:
            return {
                strength: { en: "Weak", cn: "弱" },
                message: { en: "Suggest using more character types", cn: "建议使用更多类型字符" }
            };
        case 2:
            return {
                strength: { en: "Medium", cn: "中等" },
                message: { en: "Can be stronger", cn: "还可以更强" }
            };
        case 3:
            return {
                strength: { en: "Strong", cn: "强" },
                message: { en: "Good password", cn: "不错的密码" }
            };
        case 4:
            return {
                strength: { en: "Very Strong", cn: "非常强" },
                message: { en: "Excellent password!", cn: "出色的密码！" }
            };
        default:
            return {
                strength: { en: "Weak", cn: "弱" },
                message: { en: "Please enter a valid password", cn: "请输入有效密码" }
            };
    }
}

// 测试函数，支持选择语言 / Test function with language selection
function testPasswords(passwords, language = 'cn') {
    passwords.forEach(pwd => {
        const result = checkPasswordStrength(pwd, language);
        if (language === 'en') {
            console.log(`Password: ${pwd.padEnd(20)} Strength: ${result.strength.en.padEnd(12)} Suggestion: ${result.message.en}`);
        } else {
            console.log(`密码: ${pwd.padEnd(20)} 强度: ${result.strength.cn.padEnd(6)} 建议: ${result.message.cn}`);
        }
    });
}

// 测试密码列表 / Test password list
const passwords = [
    "abc@123", "1qaz@WSX", "!QAZ@wsx", "3EDC#edc", "4RFV%tgb", "2WSX#edc", "5TGB^yhn", "6YHN&ujm", "7UJM*IK<", "8IK,(ol.", "9OL.)p;/",
    "Pass1234!@", "Password@123", "Password@1234", "Pass1234!", "Pass1234#", "Pass1234$", "Pass1234%", "Pass1234^", "Pass1234&", "Pass1234*",
    "Pass1234(", "Pass1234)", "Pass1234()", "Pass1234@", "Pass1234~", "Welcome2", "Summer123", "qweASD123", "Q1w2e3r4!", "Password@1",
    "Password@2", "Password@3", "Password@4", "Password@5", "Password@6", "Password@7", "Password@8", "Password@9", "Password@10", "Password01",
    "Password02", "Password03", "Password04", "Password05", "Password06", "Password07", "Password08", "Password09", "Password1", "Password2",
    "Password3", "Password4", "Password5", "Password6", "Password7", "Password8", "Password9", "Password10", "Pass1234", "Pass12345",
    "Pass123456", "Pass1234567", "Pass12345678", "Pass123456789", "P@ss1234", "Asdf1234", "Abcd4567", "Aaaa1111", "Aa1234567", "@WSX1qaz",
    "Saic1234", "Saic1234@", "Saic1234!", "Saci1234#", "Saic1234%", "Rauto@123", "Rauto@1234", "Risingauto@123", "Risingauto@1234", "P@ssw0rd",
    "Root1234", "Root@123", "Root@1234", "!@#$%12345", "!@#$%67890", "!@#$%^&*", "!@#$%^123456", "!@#$%^zxjhxy", "!@#$1234", "!@#$5678",
    "!@#101921", "!@#123abc", "!@#123qwe", "!@#qwe123", "!@#QWE223328", "!@#qweASD", "!@#zxc123", "!@QWASZX", "!q2w3e4r", "!Q@W#E$R",
    "!Qaz2wsx3edc", "!qaz@wsx#edc", "!QAZxsw2", "pass_123", "p@33_123", "p@ss_!@#", "pass_1234", "qwe_1234", "Password77", "Zxcv1234",
    "Zz123456", "Password19", "AAbb1234", "Abcd1234", "Bb123456", "Dd123456", "Hh123456", "Jj123456", "Password11", "Password12", "Password13",
    "Password18", "Password21", "Password23", "Password24", "Password26", "Password29", "Password31", "Password33", "Password34", "Password1234",
    "AAss1234", "Qwer1234", "1234Abcd", "1234Pass", "Aa123456", "Aa333333", "Aa654321", "Password48", "Password56", "Password66", "Password88",
    "Password99", "Pp123456", "AAaa1122", "AAAaaa123", "Bb12345678", "Mm123456", "Nn123456", "Pass2022", "1234QWer", "A123456a", "Aa012345",
    "Aa123123", "Aa7654321", "Aaa123456", "Password14", "Password15", "Password16", "Password42", "Password44", "Password55", "Password84",
    "Rewq4321", "Ss123456", "Tt123456", "Vcxz4321", "Welcome0", "Welcome02", "Welcome1", "Xx123456", "Zaq1xsw2", "1234ASdf", "1Password",
    "1q2w3e4R", "1qaz$RFV", "Cc123123", "Password17", "Password22", "Password25", "Password30", "Password39", "SQtz@0123", "Zz13301330@!@!"
];

// 只显示中文 / Display only Chinese
console.log("=== 只显示中文 / Chinese Only ===");
testPasswords(passwords, 'cn');

// 只显示英文 / Display only English
console.log("\n=== 只显示英文 / English Only ===");
testPasswords(passwords, 'en');